import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CartEntity} from "../entities/cart.entity";
import {Repository} from "typeorm";
import {CartDto} from "../dtos/cart.dto";
import {Cart_itemEntity} from "../entities/cart_item.entity";
import {CartItemDto} from "../dtos/cart_item.dto";
import {ProductService} from "../product/product.service";
import {OptionsService} from "../options/options.service";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart_itemEntity)
        private readonly cart_itemRepository: Repository<Cart_itemEntity>,
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        private readonly productService: ProductService,
    ) {
    }

    async addToCart(userId: number, cart_itemDto: CartItemDto) {
        // A. Sepeti getir veya oluştur
        const cart = await this.getOrCreateCart(userId);

        // B. Ürünü bul
        const product = await this.productService.getProductById(cart_itemDto.productId);
        if (!product) throw new NotFoundException("Ürün bulunamadı");

        // C. Opsiyonları filtrele
        const selectedOptions = (product.option || []).filter(productOption =>
            (cart_itemDto.optionIds || []).some(requestedId => Number(requestedId) === Number(productOption.id))
        );

        // KONTROL LOGU (Bunu production'da silebilirsin)
        console.log(`Ürünün Toplam Opsiyonu: ${product.option?.length}`);
        console.log(`Seçilen Opsiyon Sayısı: ${selectedOptions.length}`);

        const existingItem = await this.cart_itemRepository.findOne({
            where: {
                cart: {id: cart.id},
                product: {id: product.id},
            }
        });
        if (existingItem) {
            existingItem.quantity += cart_itemDto.quantity;

            await this.cart_itemRepository.save(existingItem);

            existingItem.product = product;

            return existingItem;
        }

        // D. Yeni Item Oluştur (Cart ID'sini TypeORM halledecek)
        const newItem = this.cart_itemRepository.create({
            cart: cart,        // Direkt entity referansı veriyoruz (ID sorunu burada çözülür)
            product: product,  // Direkt entity referansı
            quantity: cart_itemDto.quantity,
            selectedOptions: selectedOptions
        });

        // E. Item'ı kaydet
        await this.cart_itemRepository.save(newItem);

        // F. Sepet Toplam Fiyatını Güncelle
        // (Not: İstersen burada tüm itemları çekip baştan hesaplatabilirsin, bu daha güvenlidir)
        const itemPrice = this.calculateItemPrice(product, selectedOptions, cart_itemDto.quantity);
        cart.totalPrice = Number(cart.totalPrice) + itemPrice;
        await this.cartRepository.save(cart);

        // G. Final: Taze veriyi dön
        return this.getCart(userId);
    }

    // 2. YARDIMCI: Sepeti Getir (İlişkilerle Birlikte)
    async getCart(userId: number) {
        const cart = await this.cartRepository.findOne({
            where: {user: {id: userId}},
            relations: [
                'cart_item',
                'cart_item.product',
                'cart_item.product.restaurant', // Restoran bilgisi burada gelir
                'cart_item.selectedOptions',
            ],
            order: {id: 'DESC'} // Varsa en son sepet gelir
        });

        // Temiz bir başlangıç için boş obje dön
        if (!cart) return {totalPrice: 0, cart_item: []};

        // Opsiyonel: Response'u temizle (Product içindeki tüm opsiyon listesini sil)
        cart.cart_item.forEach(item => {
            if (item.product) delete (item.product as any).option;
        });

        return cart;
    }

    // 3. YARDIMCI: Sepet Yoksa Oluştur (Private Method)
    private async getOrCreateCart(userId: number): Promise<CartEntity> {
        let cart = await this.cartRepository.findOne(
            {where: {user: {id: userId}}});

        if (!cart) {
            cart = this.cartRepository.create({
                user: {id: userId},
                totalPrice: 0
            });
            await this.cartRepository.save(cart);
        }
        return cart;
    }


    // 4. YARDIMCI: Fiyat Hesaplama
    private calculateItemPrice(product: any, options: any[], quantity: number): number {
        const optionsTotal = options.reduce((sum, opt) => sum + Number(opt.priceModifier), 0);
        return (Number(product.price) + optionsTotal) * quantity;
    }


    async removeItem(itemId: number, userId: number) {

        const item = await this.cart_itemRepository.findOne({
            where: { id: itemId, cart: { user: { id: userId } } },
            relations: ["cart", "product"]
        });

        if (!item) throw new NotFoundException("Sepetinizde böyle bir ürün bulunamadı");
        const reducePrice = item.product.price * item.quantity;

        item.cart.totalPrice = Math.max(0, item.cart.totalPrice - reducePrice);
        await this.cartRepository.save(item.cart);
        await this.cart_itemRepository.delete(itemId);

        return {
            message: "Ürün sepetten kaldırıldı",
            newTotalPrice: item.cart.totalPrice
        };
    }

    async removeAllCartItems(userId: number) {
        const carts = await this.cartRepository.findOne({
            where: {    user: { id: userId  } },
        });
        if(!carts) {
            throw new NotFoundException("Sepetinizde zaten ürün yok")
        }

        await this.cart_itemRepository.delete({ cart: { id: carts.id } });

        carts.totalPrice = 0;
        await this.cartRepository.save(carts);

        return {
            message: "Sepet tamamen boşaltıldı",
            newTotalPrice: 0
        };

    }
}
