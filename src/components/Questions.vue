<template>
    <div>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">Questions</th>
                <th class="text-left">Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in results" :key="item.question_id">
                <td><a :href="item.link" >{{ item.title }}</a></td>
                <td>{{ item.score }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: [
            'results'
        ],
        data() {
            return {}
        },
        methods: {
        },
        computed: {
            computed(): string {
                return "";
            }
        },
        beforeMount() {
        }
    });
</script>

<style>
</style>