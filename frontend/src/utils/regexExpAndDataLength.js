const regex = {
    NAME                : /^(?!\s)[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    PHONE_NUMBER        : /^[1-9]\d{9}$/,
    EMAIL               : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    STRING_VARCHAR      : /^[a-zA-Z0-9,.!?'"()\s]*$/,
    PASSWORD            : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[^\s]{8,16}$/,
    NUMBER_ONLY         : /^[0-9]+$/,
}

const dataLength = {
    NAME                        : 30,
    PHONE_NUMBER                : 10,
    STRING_VARCHAR_SHORT        : 50,
    STRING_VARCHAR_LONG         : 300,
    PASSWORD                    : 16,
    EMAIL                       : 50,
}

export {regex, dataLength};