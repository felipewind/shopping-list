export interface Header {

    headerType: HeaderType,
    shoppingName?: string;
    
}

export enum HeaderType {
    LOGIN = 'Login',
    SIGNUP = 'Create account',
    SHOPPING = 'Shopping lists',
    SHOPPING_DELETE = 'Shopping litsts - Delete',
    PRODUCT = 'Shopping list'
}