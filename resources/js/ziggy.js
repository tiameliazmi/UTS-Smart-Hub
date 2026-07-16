import { Ziggy } from '@/ziggy-generated';
import { route as ziggyRoute } from 'ziggy-js';

// Make route() available globally for React components
window.route = ziggyRoute;
window.Ziggy = Ziggy;

export { ziggyRoute as route };