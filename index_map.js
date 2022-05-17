'use strict'

//accepts new IndexedMap([k, v], [k2, v2])
class IndexedMap {
    constructor() {
        this.indexedMap = [...arguments];
    }

    set(key, value) {
        this.indexedMap.push([key, value]);
        return this;
    }

    has(key) {
        return this.indexedMap.some((item) => JSON.stringify(item[0]) === JSON.stringify(key));  
    }

    hasIndex(index) {
        return this.indexedMap.some((item, mapIndex) => index === mapIndex);
    }

    get(key) {
        return this.indexedMap.find((item) => JSON.stringify(item[0]) === JSON.stringify(key))[1] ?? null; 
    }

    getByIndex(index) {
        return this.indexedMap.find((item, mapIndex) => index === mapIndex) ?? null;
    }
        
    remove(key) {
        const index = this.indexedMap.findIndex((item) => JSON.stringify(item[0]) === JSON.stringify(key));
        this.indexedMap.splice(index, 1);
        return this;
    }

    size() {
        return this.indexedMap.length;
    }

    forEach(callback) {
        for (let i = 0; i < this.indexedMap.length; i++) {
            const element = this.indexedMap[i];
            callback.call(this, element[1], element[0], i);
        }
        return this;
    }

    union(...maps) {
        for(let map of maps) {
            this.indexedMap = this.indexedMap.concat(map.indexedMap);
        }
        return this;
    }

    unique() {
        const unique = new Set();
        this.indexedMap.forEach((value) => {
            unique.add(value[1]); 
        })
        return unique;
    }  

    uniqueKeys() {
        const uniqueKeys = new Set();
        this.indexedMap.forEach((value) => {
            uniqueKeys.add(value[0]); 
        })
        return uniqueKeys;
    }

    sort(callback) {
        this.indexedMap.sort((item1, item2) => callback(item1[1], item2[1], item1[0], item2[0]));
        return this;
    }

    sortIndexes(callback) {
        const auxilaryArr = [];
        const finalArr = [];
        for (let i = 0; i < this.indexedMap.length; i++) {
            auxilaryArr.push(i);
        }
        auxilaryArr.sort(callback);
        auxilaryArr.forEach((value) => {
            finalArr.push(this.indexedMap[value]);
        })
        this.indexedMap = finalArr;
        return this;

    }

    setTo(index, value) {
        if (Array.isArray(value) && value.length === 2) {
            this.indexedMap.splice(index, 0, value);
            return this;
        }
        else {
            throw new Error()
        }
    }

    removeAt(index, count = 1) {
        this.indexedMap.splice(index, count);
        return this;
    }
}
