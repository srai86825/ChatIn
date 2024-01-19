const verifyId=(str)=>{
    return /^[0-9a-fA-F]{24}$/.test(str);
}

export default verifyId;