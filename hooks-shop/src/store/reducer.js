import { combineReducers } from 'redux';
import { reducer as categoryReducer } from 'pages/category/store';
import { reducer as detailsReducer } from '../pages/details/store';
import { reducer as shoppingCartReducer } from '../pages/shoppingCart/store';
// import { reducer as loginReducer } from '../pages/login/store';

export default combineReducers({
	category: categoryReducer,
	detail: detailsReducer,
	shoppingCart: shoppingCartReducer
})