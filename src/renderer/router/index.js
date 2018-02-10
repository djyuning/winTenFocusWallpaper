import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'PageMain',
			component: require('@/view/main').default,
		},
		{
			path: '*',
			redirect: '/'
		},
	]
});
