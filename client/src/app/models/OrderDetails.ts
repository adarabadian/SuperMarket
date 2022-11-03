export class OrderDetails{
    public constructor(      
        public city?:         string,
        public street?:       string,
        public deliveryDate?: Date,
        public creditCard?:   number
    ){}

}