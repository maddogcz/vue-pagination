import {ref, computed, watch} from "vue";

export function pagination(objects){
    const onPage = ref(5);
    const page = ref(1);
    const indexes = ref([]);

    function getIndexes(){
        const idxs = [];
        if(objects.value){
            for(let i=0; i<objects.value.length; i++){
                idxs.push(i);
            }
        }
        indexes.value = idxs;
    }

    getIndexes();

    const pages = computed(()=>{
        return Math.ceil(objects.value.length / onPage.value);
    });

    const first = computed(()=>{
        return (page.value - 1) * onPage.value;
    });
    
    const last = computed(()=>{
        return Math.min(first.value + onPage.value, indexes.value.length);
    });

    const objectsPage = computed(()=>{
        const res = [];
        for(let i=first.value; i<last.value; i++){
            res.push(objects.value[indexes.value[i]]);
        }
        return res;
    });

    watch(pages, ()=>{
        if(pages.value < page.value){
            page.value = 1;
        }
    });

    watch(
        objects,
        ()=>{
            getIndexes();
        },
        {
            deep: true
        },
    );

    function sort(fc, reverse=false){
        if(fc){
            indexes.value.sort((i1, i2)=>{
                return fc(objects.value[i1], objects.value[i2]);
            });
        }
        else{
            indexes.value.sort();
        }
        if(reverse){
            indexes.value.reverse();
        }
    }

    function sortAttr(attr, reverse=false){
        sort((d1, d2)=>{
            const v1 = d1[attr], v2 = d2[attr];
            if(v1 < v2){
                return -1;
            }
            else if(v1 > v2){
                return 1;
            }
            else{
                return 0;
            }
        }, reverse);
    }

    return {
        onPage,
        page,
        pages,
        first,
        last,
        objectsPage,
        sort,
        sortAttr,
    }

}
