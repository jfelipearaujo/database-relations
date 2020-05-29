import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const result = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return result;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => product.id);

    const findProducts = await this.ormRepository.find({
      id: In(ids),
    });

    const updatedProductsList = findProducts.map(product => {
      const updatedProduct = product;

      const requestedProduct = products.find(
        productUpdateRequest => productUpdateRequest.id === product.id,
      );

      if (requestedProduct) {
        updatedProduct.quantity = requestedProduct.quantity;
      }

      return updatedProduct;
    });

    const updatedProducts = await this.ormRepository.save(updatedProductsList);

    return updatedProducts;
  }
}

export default ProductsRepository;
