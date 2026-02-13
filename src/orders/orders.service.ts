import {BadRequestException, Injectable} from '@nestjs/common';
import {DataSource, Repository} from "typeorm";
import {CartEntity} from "../entities/cart.entity";
import {OrderEntity} from "../entities/order.entity";
import {Cart_itemEntity} from "../entities/cart_item.entity";
import {Order_itemEntity} from "../entities/order_item.entity";
import {OrderStatus} from "../enum/order.enum";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class OrdersService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(OrderEntity)
        private readonly ordersRepository: Repository<OrderEntity>,
    ) {
    }

    async createOrder(userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cart = await queryRunner.manager.findOne(CartEntity, {
                where: {user: {id: userId}},
                relations: [
                    'cart_item',
                    "cart_item.product",
                    "cart_item.option",
                    "cart_item.product.restaurant",]
            });
            if (!cart || cart.cart_item.length === 0) {
                throw new BadRequestException("Sepetiniz boş, sipariş oluşturulamadı");
            }
            const restaurant = cart.cart_item[0].product.restaurant;
            const newOrder = queryRunner.manager.create(OrderEntity, {
                user: {id: userId},
                finalPrice: cart.totalPrice,
                restaurant: restaurant,
                status: OrderStatus.PENDING,
                createdAt: new Date()
            });
            const savedOrder = await queryRunner.manager.save(newOrder);
            for (const item of cart.cart_item) {
                const orderItem = queryRunner.manager.create(Order_itemEntity, {
                    order: savedOrder,
                    product: item.product,
                    quantity: item.quantity,
                    priceAtTime: item.product.price,
                    option: item.option
                });

                await queryRunner.manager.save(orderItem);
            }
            const itemIds = cart.cart_item.map(item => item.id);

            if (itemIds.length > 0) {
                await queryRunner.manager.delete(Cart_itemEntity, itemIds);
            }
            cart.totalPrice = 0;
            cart.cart_item = [];

            await queryRunner.manager.save(cart);

            const fullOrderDetails = await queryRunner.manager.findOne(OrderEntity, {
                where: {id: savedOrder.id},
                relations: [
                    'order_item',
                    'order_item.product',
                    'order_item.option'
                ]
            });

            await queryRunner.commitTransaction();

            return {
                message: "Sipariş başarıyla oluşturuldu",
                orderId: savedOrder.id,
                order: fullOrderDetails
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getOrdersByUserId(userId: number) {
        const orders = await this.ordersRepository.find({
            where: {user: {id: userId}},
            relations: ["order_item", "order_item.product",'order_item.product', "order_item.option", "restaurant"],
            order: {
                createdAt: 'DESC'
            }
        });
        return orders;
    }
}