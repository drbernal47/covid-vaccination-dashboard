function toStateID(stateName) {
    switch(stateName) {
        case 'Arizona': return('AZ');
            break;
        case 'Alaska': return('AK');
            break;
        default:
            return('State not found');
    }
}


console.log(toStateID('Alaska'));