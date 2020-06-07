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
        <query :query=query :darkMode=darkMode></query>
    </div>
    `,
    data: { 
        query: "",
        darkMode: true
    },
    components: {
        Query,
        Header
    },
    methods: {
        updateMode(mode) {
            this.darkMode = mode;
            // console.log(this.darkMode);
        }
    },
    beforeMount: function(){
        this.query = this.$el.attributes['data-query'].value;
    }
});
