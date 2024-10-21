runif = (a, b) => {
    return Math.random() * b + a;
};

rnorm = (n, mean, sd) => {
    values = new Array(n);
    for (let i = 0; i < n; i += 2) {
        u = Math.random();
        v = Math.random();
        values[i] = sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + mean;
        values[i + 1] = sd * Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v) + mean;
    }

    if (n % 2 == 1) {
        u = Math.random();
        v = Math.random();
        values[n - 1] = sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + mean;
    }

    if (n == 1) {
        return values[0];
    }

    return values;

};

sample = (elements, size, replace) => {
    let n = size ?? 1;
    let rep = replace ?? false;
    let random_sample = new Array(n);

    if (rep){
        for (let i = 0; i < n; i++){
            random_sample[i] = elements[Math.floor(Math.random() * elements.length)];
        }
    }
    else {
        let elem = new Array(elements.length);
        for (let i = 0; i < elements.length; i++){
            elem[i] = elements[i];
        }
        
        for (let i = 0; i < n; i++){
            let index = Math.floor(Math.random() * elem.length)
            let aux = elements[elem.length - 1];
            elem[elem.length - 1] = elem[index];
            elem[index] = aux;
            random_sample[i] = elem.pop();
        }
    }

    if (n > 1){
        return random_sample;
    }
    else{ 
        return random_sample[0];
    }
}

