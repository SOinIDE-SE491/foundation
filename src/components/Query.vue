<template>
    <div>
        <v-text-field
            solo
            autocomplete="off"
            label="Enter Search Query"
            v-model="query"
            v-on:keyup.enter="queryStackExchange"
            id="input-search"
            append-icon="search"
            @click:append="queryStackExchange"
            >
        </v-text-field>
        <questions :results=results></questions>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Questions from "./Questions.vue";

    const axios = require("axios");

    export default Vue.extend({
        components: {
            Questions
        },
        props: [
            "query"
        ],
        data() {
            return {
                results: [],
                page: 1,
                limit: 5
            }
        },
        methods: {
            queryStackExchange() {
                let _this = this;
                axios.get(
                        "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow"
                        +"&page="+this.page
                        +"&pagesize="+this.limit
                        +"&q="+this.query
                    ).then(function (response: any) {
                        _this.results = response.data.items
                    });
            }
        },
        mounted: function(){
            if (this.query != '') {
                this.queryStackExchange();
            }
        }
    });
</script>

<style>
</style>