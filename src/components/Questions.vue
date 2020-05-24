<template>
    <div>
        <!-- <v-simple-table>
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
        </v-simple-table> -->
        <hr id="hrTop">
        <div class="questionContainer" v-for="item in results" :key="item.question_id">
            <div class="questionStats">
                  <div class="votes">
                    <strong class="votesScore">{{item.score}}</strong>
                    <div class="votesTag">votes</div>
                  </div>
                  <div class="answers">
                    <strong class="answersScore">{{item.answer_count}}</strong>
                    <div class="answersTag">answers</div>
                  </div>
                  <div class="views">
                    <div>{{item.view_count}}</div>
                    <div>views</div>
                  </div>
            </div>

            <div class="summary">
                <a :href="item.link">
                    <div class="question">
                            Q:{{ item.title }}
                    </div>
                </a>

                <div class="tags">
                    <div class="tagOne">
                        {{item.tags}}
                    </div>
                </div>

                <div class="userInfo">
                    <div class="userImage">
                        <div class="userImage">
                            <img :src="item.owner.profile_image">
                            <div class="userName">
                                {{item.owner.display_name}}
                                    <div class="userReputation">
                                    reputation: {{item.owner.reputation}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
      .hrTop {
        border:1px solid lightgray;
      }

      .questionContainer {
        display:flex;
        margin-bottom: 10px;
        margin-top: 5px;
        border-bottom: 1px solid lightgray;
      }

      .questionStats {
        width:60px;
        text-align:center;
        padding:3px;
        margin-bottom: 5px;
        border-left: 3px solid #f48024;
      }

      .votes {
        margin-bottom:10px;
        /* background-color:rgb(94, 186, 125); */
        border-radius:3px;
        padding:2px;
      }

      .votesScore {
        font-size:14px;
      }

      .votesTag {
        font-size:9px;
      }

      .answers {
        background-color:rgb(94, 186, 125);
        border-radius:3px;
        padding:2px;
      }

      .answersScore {
        font-size:14px;
        color:white;
      }

      .answersTag {
        font-size:9px;
        color:white;
      }

      .views {
        /* background-color:rgb(94, 186, 125); */
        border-radius:3px;
        padding:2px;
        margin-top:10px;
        color:#f48024;
        font-size:9px;
      }

      .question {
        width:100%;
        margin-left:10px;
        display:flex;
        justify-content:center;
        align-items:top;
        word-break:break-word;
        padding-top:5px;
      }

      .tags {
        font-size:10px;
        margin-left:20px;
      }

      .tagOne {
        padding:3px;
        color:rgb(57, 115, 157);
      }

      .userInfo {
        margin-top:5px;
        margin-bottom:5px;
        margin-left:20px;
        font-size:10px;
        width:170px;
        position:static;
        display:block;
      }

      .userImage {
        height:32px;
        width:32px;
        display:flex;
      }

      .userName {
        margin-left:7px;
        text-align:left;
        color:rgb(57, 115, 157);
      }

      .userReputation {
        color:gray;
        width:120px;
      }

</style>