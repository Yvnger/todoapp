import { DEFAULT_STORAGE, DEFAULT_OWNER } from "./constants.js";

// Берем значение типа хранилища из локального хранилища
export function getStorageType() {
    const currentStorage = localStorage.getItem('storageType');

    if (!currentStorage) {
        setStorageType(DEFAULT_STORAGE);
        getStorageType();
    }
    
    return currentStorage;
}

// Назначаем тип хранилища в локальном хранилище
export function setStorageType(type) {
    localStorage.setItem('storageType', type);
}

// Берем значение текущего владельца списка из локального хранилища
export function getOwner() {
    const currentOwner = localStorage.getItem('owner');

    if (!currentOwner) {
        setOwner(DEFAULT_OWNER);
        getOwner();
    }
    
    return currentOwner;
}

// Назначаем владельца списка в локальном хранилище
export function setOwner(owner) {
    localStorage.setItem('owner', owner);
}