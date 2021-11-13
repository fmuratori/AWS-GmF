export default interface Address {
    street: string,
    civicNumber: string,
    city: string,
    coordinates: {
        x: number,
        y: number
    }
}