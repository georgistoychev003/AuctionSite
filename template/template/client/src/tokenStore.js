import { writable } from 'svelte/store';

// Check for token in local storage during initialization
const initialToken = localStorage.getItem('userToken');

const tokenStore = writable(initialToken);

// Subscribe to changes in the store. If the token changes, update local storage
tokenStore.subscribe(value => {
    if (value) {
        localStorage.setItem('userToken', value);
    } else {
        localStorage.removeItem('userToken');
    }
});

export function setToken(token) {
    tokenStore.set(token);
}

export function removeToken() {
    tokenStore.set(null);
}

export default tokenStore;
