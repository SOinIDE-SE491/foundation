<template>
    <div>
        <div class="">Hello World</div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    const axios = require("axios");

    export default Vue.extend({
        props: [],
        data() {
            return {
            }
        },
        methods: {
            query(query: string) {
                axios.get(
                        "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=" +
                        query
                    ).then(function (response: any) {
                        console.log(response);
                    });
            }
        },
        computed: {
            computed(): string {
                return "";
            }
        }
    });
</script>

<style>
</style>