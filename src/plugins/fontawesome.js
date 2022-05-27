//https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

//setup fontawesome
library.add(fab, far, fas);

//exports
export const fabIcons = fab;
export const farIcons = far;
export const fasIcons = fas;