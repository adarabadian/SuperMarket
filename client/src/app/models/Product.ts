import { types } from "util"

export class Product{
    public constructor(
        public id?:       number,
        public name?:     string,
        public category?: any,
        public price?:    any,
        public picture?:  any
    ){}
    // product category and pictures are any because admin functions need to use them in several types.
    // for example, if uploading Product, an ID (number) will be sent
}