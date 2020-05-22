import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products_to_add: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    customer_id,
    products_to_add,
  }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const findProducts = products_to_add.map(product => ({
      id: product.id,
    }));

    const productsFounded = await this.productsRepository.findAllById(
      findProducts,
    );

    const products = productsFounded.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: product.price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products,
    });

    return order;
  }
}

export default CreateProductService;
