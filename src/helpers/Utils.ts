export function isDateObject(possibleDate: any) {
    return possibleDate && Object.prototype.toString.call(possibleDate) === "[object Date]" && !isNaN(possibleDate);    
}

export function isString  (possibleString: any){
    return typeof possibleString === 'string';
}

export function isValidDateString  (value: string){
    return !isNaN(Date.parse(value));
}