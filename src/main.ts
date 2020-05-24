import Vue from "vue";
import * as Vuetify from "vuetify";
import Query from "./components/Query.vue";

Vue.use(Vuetify);

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <query :query=query></query>
    </div>
    `,
    data: { query: "" },
    components: {
        Query
    },
    beforeMount: function(){
        this.query = this.$el.attributes['data-query'].value;
    }
});
