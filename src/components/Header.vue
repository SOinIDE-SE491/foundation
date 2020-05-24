<template>
    <div class="header">
        <v-toolbar class="toolbar" dense :dark="darkMode">
            <v-icon style="margin-right: 5px; color:#0077b6;">mdi-alpha-s-circle</v-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon @click="toggleMode(), $emit('changeMode', darkMode)" >
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>

            {{onMode}}

        </v-toolbar>
    </div>  
</template>

<script lang="ts">
    import Vue from 'vue'
    export default Vue.extend({
        name: "Header",
        data() {
            return {
                title: "StackOverflow IDE",
                darkMode: true,
                onMode: "Dark Mode"
            }
        },
        methods: {
            toggleMode() {
                this.darkMode = !this.darkMode
                if (this.darkMode == true) {
                    this.onMode = "Dark Mode";
                    document.body.style.backgroundColor = "#252526";
                } else {
                    this.onMode = "Light Mode";
                    document.body.style.backgroundColor = "white";
                    
                }
            }
        }
    });
</script>

<style>  
    .header {
        margin-top: 20px;
    }
</style>