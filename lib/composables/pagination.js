import {ref, computed, watch} from "vue";

export function pagination(objects){
    const onPage = ref(5);
    const page = ref(1);

    let currentSortFunction = null;
    let currentReverse = false;
    const updater = ref(0);

    const indexes = computed(() => {
        const idxs = [];
        updater.value;
        if(objects.value){
            for(let i=0; i<objects.value.length; i++){
                idxs.push(i);
            }
        }
        if(currentSortFunction){
            idxs.sort((i1, i2)=>{
                return currentSortFunction(objects.value[i1], objects.value[i2]);
            });
        }
        else if (currentSortFunction === undefined){
            idxs.sort();
        }
        if (currentReverse) {
            idxs.reverse()
        };
        return idxs;
    });

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
            updater.value++;
        },
        {
            deep: true
        },
    );

    function sort(fc, reverse=false){
        currentSortFunction = fc;
        currentReverse = reverse;
        updater.value++;
    }

    function sortValue(fc, reverse=false){
        sort((i1, i2)=>{
            let v1 = fc(i1);
            if(v1 === undefined){
                v1 = null;
            }
            let v2 = fc(i2);
            if(v2 === undefined){
                v2 = null;
            }
            const rval = reverse ? -1 : 1;
            let ret;
            if(v1 == v2){
                ret = 0;
            }
            else if(v1 === null){
                ret = rval;
            }
            else if(v2 === null){
                ret = -1 * rval;
            }
            else if(v1 < v2){
                ret = -1;
            }
            else if(v1 > v2){
                ret = 1;
            }
            return ret;
        }, reverse);
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
        sortValue,
    }
}
