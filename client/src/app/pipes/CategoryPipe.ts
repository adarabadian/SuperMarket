import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
    name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {

    transform(products: Product[], categoryName: string): any {
        // In this example we filter all coupons whose price is about 350
        return products.filter(product => product.category.includes(categoryName));
    }
}
