import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CartEntity} from "../entities/cart.entity";
import {Repository} from "typeorm";
import {Cart_itemEntity} from "../entities/cart_item.entity";
import {CartItemDto} from "../dtos/cart_item.dto";
import {ProductService} from "../product/product.service";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart_itemEntity)
        private readonly cartItemRepository: Repository<Cart_itemEntity>,
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        private readonly productService: ProductService,
    ) {
    }

    async addToCart(userId: number, dto: CartItemDto) {
        let cart = await this.getOrCreateCart(userId);

        const product = await this.productService.getProductById(dto.productId);
        if (!product) throw new NotFoundException("Ürün bulunamadı");


        if (cart.cart_item.length > 0) {
            const currentRestaurantId = cart.cart_item[0].product.restaurant.id;
            if (currentRestaurantId !== product.restaurant.id) {
                throw new BadRequestException("Sepette farklı bir restoranın ürünü var. Önce sepeti temizleyin.");
            }
        }

        const incomingOptionIds = (dto.optionIds || []).map(id => Number(id)).sort();
        const selectedOptions = (product.option || []).filter(opt =>
            incomingOptionIds.includes(Number(opt.id))
        );


        let matchedItem = cart.cart_item.find(item => {
            if (item.product.id !== product.id) return false;

            // Opsiyon ID'lerini karşılaştır
            const currentOptionIds = item.option.map(opt => Number(opt.id)).sort();
            return JSON.stringify(currentOptionIds) === JSON.stringify(incomingOptionIds);
        });

        if (matchedItem) {
            matchedItem.quantity += dto.quantity;
            await this.cartItemRepository.save(matchedItem);
        } else {
            const newItem = this.cartItemRepository.create({
                cart: cart,
                product: product,
                quantity: dto.quantity,
                option: (dto.optionIds || []).map(id => ({id: Number(id)}))
            });

            await this.cartItemRepository.save(newItem);
        }

        await this.recalculateCartTotal(cart.id);

        return this.getCart(userId);
    }

    async removeItem(itemId: number, userId: number) {
        const item = await this.cartItemRepository.findOne({
            where: {id: itemId, cart: {user: {id: userId}}},
            relations: ["cart"]
        });

        if (!item) throw new NotFoundException("Ürün bulunamadı");

        await this.cartItemRepository.delete(itemId);

        await this.recalculateCartTotal(item.cart.id);

        return {message: "Ürün silindi", cart: await this.getCart(userId)};
    }

    // --- YARDIMCI METODLAR ---

    // Sepeti Getir (Okuma Modu)
    async getCart(userId: number) {
        return this.cartRepository.findOne({
            where: {user: {id: userId}},
            relations: [
                'cart_item',
                'cart_item.product',
                'cart_item.option',
                'cart_item.product.restaurant'

            ],
            order: {id: 'DESC'}
        });
    }

    private async getOrCreateCart(userId: number): Promise<CartEntity> {
        let cart = await this.cartRepository.findOne({
            where: {user: {id: userId}},
            relations: ['cart_item', 'cart_item.product', 'cart_item.option', 'cart_item.product.restaurant',]
        });

        if (!cart) {
            cart = this.cartRepository.create({user: {id: userId}, totalPrice: 0});
            await this.cartRepository.save(cart);
            // Yeni oluşturulan sepetin item dizisi boştur
            cart.cart_item = [];
        }
        return cart;
    }

    private async recalculateCartTotal(cartId: number) {
        const cart = await this.cartRepository.findOne({
            where: {id: cartId},
            relations: ['cart_item', 'cart_item.product', 'cart_item.option']
        });

        if (!cart) return;

        let total = 0;
        for (const item of cart.cart_item) {
            let itemPrice = Number(item.product.price);

            if (item.option) {
                for (const opt of item.option) {
                    itemPrice += Number(opt.priceModifier || 0);
                }
            }

            total += itemPrice * item.quantity;
        }

        cart.totalPrice = total;
        await this.cartRepository.save(cart);
    }
/*
    private calculateItemPrice(product: any, options: any[], quantity: number): number {
        const optionsTotal = options.reduce((sum, opt) => sum + Number(opt.priceModifier), 0);
        return (Number(product.price) + optionsTotal) * quantity;
    }*/


    async removeAllCartItems(userId: number) {
        const carts = await this.cartRepository.findOne({
            where: {user: {id: userId}},
        });
        if (!carts) {
            throw new NotFoundException("Sepetinizde zaten ürün yok")
        }

        await this.cartItemRepository.delete({cart: {id: carts.id}});

        carts.totalPrice = 0;
        await this.cartRepository.save(carts);

        return {
            message: "Sepet tamamen boşaltıldı",
            newTotalPrice: 0
        };

    }
}
