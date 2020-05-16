import Vue from "vue";
import Vuetify from "vuetify";
import Results from "./components/Results.vue";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <h1>Test</h1>
        <results></results>
        </div>
    `,
    data: { name: "Main" },
    components: {
        Results
    }
});
