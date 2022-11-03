import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
    name: 'searchPipe'
})

export class SearchPipe implements PipeTransform {

    transform(products: any, userSearch: string): any {
        // if in checkout component products will be map instead of array so  this is converting products to array and then filtering
        if (!Array.isArray(products)) {
            return Array.from(products.values()).filter((product: Product) => product.name.toUpperCase().includes(userSearch.toUpperCase()));
        }
        
        return products.filter(product => product.name.toUpperCase().includes(userSearch.toUpperCase()));
    }
}
