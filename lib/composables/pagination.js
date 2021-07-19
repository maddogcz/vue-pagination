import {ref, computed} from "vue";

export function pagination(objects){
    const onPage = ref(5);
    const page = ref(1);

    const pages = computed(()=>{
        return Math.ceil(objects.value.length / onPage.value);
    });

    const first = computed(()=>{
        return (page.value - 1) * onPage.value;
    });
    
    const last = computed(()=>{
        return Math.min(first.value + onPage.value, objects.value.length);
    });

    const objectsPage = computed(()=>{
        const res = [];
        for(let i=first.value; i<last.value; i++){
            res.push(objects.value[i]);
        }
        return res;
    });

    return {
        onPage,
        page,
        pages,
        first,
        last,
        objectsPage,
    }

}
