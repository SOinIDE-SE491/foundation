import Vue from "vue";
import * as Vuetify from "vuetify";
import Query from "./components/Query.vue";
import Header from "./components/Header.vue";

Vue.use(Vuetify);

let v = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    template: `
    <div data-app>
        <Header v-on:changeMode="updateMode"/>
        <query :query=query :darkMode=darkMode :favorites=favorites></query>
    </div>
    `,
    data: { 
        query: "",
        darkMode: true,
        favorites: Array()
    },
    components: {
        Query,
        Header
    },
    methods: {
        updateMode(mode) {
            this.darkMode = mode;
        }
    },
    beforeMount: function(){
        this.query = this.$el.attributes['data-query'].value;
        this.favorites = this.$el.attributes['data-favorites'].value;
    }
});
