// config
switch (MODE) {
    case 'PROD':
        CF_DATA = CF_DATA_PROD;
        break;
    case 'QAT':
        CF_DATA = CF_DATA_QAT;
        break;
    case 'DEV':
        CF_DATA = CF_DATA_DEV;
        break;
    default:
        CF_DATA = CF_DATA_PROD;
}
