<template>
  <div>
    <!-- Begin Answers Section -->
    <div v-if="qid != null">
      <div class="answer-pages">
        <v-btn
          class="answers-btn p-answers-btn"
          dark
          color="#0077b6"
          @click="previousAnswer"
        >Previous Answer</v-btn>
        <v-btn
          class="answers-btn n-answers-btn"
          dark
          color="#0077b6"
          @click="nextAnswer"
        >Next Answer</v-btn>
      </div>
      <hr id="hrTop" />
      <br />
      <div class="answerContainer">
        <div class="answerStats">
          <div class="pagesSelection">
            <strong class="pages">{{ currentAnswer + 1 }} / {{ answerIds.length }}</strong>
            <div class="pagesTag">pages</div>
          </div>
          <div class="votesAnswer">
            <strong class="votesScore">{{ userInfo.answerScore }}</strong>
            <div class="votesTag">votes</div>
          </div>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="hide-answers-button" @click="qid = null">
                <svg
                  class="bi bi-arrow-left"
                  width="2em"
                  height="2em"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.854 4.646a.5.5 0 0 1 0 .708L3.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2.5 8a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </div>
            </template>
            <span>Back to questions</span>
          </v-tooltip>
        </div>

        <div class="summary">
          <div>
            <div class="question">
              <strong>Q: {{ question }}</strong>
            </div>
            <div class="userInfoAnswer">
              <div class="answerDate">answered: {{ parseDate(userInfo.creationDate) }}</div>
              <div class="userImage">
                <div class="userImage">
                  <img :src="userInfo.profileImage" />
                  <div class="userName">
                    <a :href="userInfo.userLink">{{ userInfo.displayName }}</a>
                    <div class="userReputation">reputation: {{ userInfo.reputation }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="answerBody">
            <p id="html-code" v-html="answer"></p>
            <v-snackbar v-model="snackbar" :timeout="timeout">
              {{ snackbarText }}
              <v-btn dark text @click="snackbar=false">X</v-btn>
            </v-snackbar>
          </div>
        </div>
      </div>
    </div>
    <!-- End Answers Section -->

    <hr id="hrTop" />
    <div
      v-if="qid == null">
      <div
        class="questionContainer"
        v-for="item in results"
        :key="item.question_id"
      >
      
        <div class="questionStats">
          <div class="votes">
            <strong class="votesScore">{{ item.score }}</strong>
            <div class="votesTag">votes</div>
          </div>
          <favorite :question_id=item.question_id :is_favorite=isFavorite(item.question_id) :vscode=vscode></favorite>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <div class="answers" v-on="on"
              v-on:click="
                    qid = item.question_id;
                    question = item.title;
                    currentAnswer = 0;
                    getAnswerIds(item.question_id);
                  ">
                <strong class="answersScore"
                  >{{ item.answer_count }}</strong
                >
                <div class="answersTag">answers</div>
              </div>
            </template>
            <span>See all answers</span>
          </v-tooltip>
          <div class="views">
            <div>{{ item.view_count }}</div>
            <div>views</div>
          </div>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <div v-on="on" class="eyeIcon">
                  <div v-on:click="isHidden = !isHidden">
                    <v-icon v-if="isHidden==true" color="rgb(94, 186, 125)">mdi-eye</v-icon>
                    <v-icon v-else color="rgb(94, 186, 125)">mdi-eye-off</v-icon>
                  </div>
              </div>
            </template>
          <span v-if="isHidden==true">See full question</span>
          <span v-else>Close question</span>
          </v-tooltip>
        </div>

        <div class="summary">
          <div style="display:block;">
          <a :href="item.link">
            <div class="question"><strong>Q: {{ item.title }}</strong></div>
          </a>
          <div class="userInfoQuestion">
            <div class="questionDate">asked: {{ parseDate(item.creation_date) }}</div>
            <div class="userImage">
              <div class="userImage">
                <img :src="item.owner.profile_image" />
                <div class="userName">
                  <a :href="item.owner.link">{{ item.owner.display_name }}</a>
                  <div class="userReputation">reputation: {{ item.owner.reputation }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isHidden" class="questionBody">
          <!--
              To Display Text only:
              {{item.body}} 
          -->
          <p>
            <span v-html="item.body"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Favorite from "./Favorite.vue";
const axios = require("axios");

export default Vue.extend({
  components: {
    Favorite,
  },
  props: ["results", "vscode", "favorites"],
  data() {
    return {
      qid: null,
      question: null,
      answerIds: null,
      currentAnswer: 0,
      answer: null,
      questionBody: null,
      userInfo: {
        reputation: null,
        creationDate: null,
        profileImage: "",
        displayName: "",
        userLink: "",
        answerScore: null
      },
      wrapAnswer: null,
      snackbarText: "Copied To Clipboard",
      snackbar: false,
      timeout: 5000,
      isHidden: true
    };
  },
  methods: {
    getAnswerIds(qid: string) {
      let _this = this;
      axios
        .get(
          `https://api.stackexchange.com/2.2/questions/${qid}/answers?order=desc&sort=votes&site=stackoverflow`
        )
        .then(function(response: any) {
          _this.answerIds = response.data.items.map(a => a.answer_id);
          if (_this.answerIds != null) {
            _this.getAnswer(_this.answerIds[0]);
          }
        });
    },
    nextAnswer() {
      if (this.currentAnswer < this.answerIds.length) {
        this.currentAnswer = this.currentAnswer + 1;
      }
      this.getAnswer(this.answerIds[this.currentAnswer]);
    },
    previousAnswer() {
      if (this.currentAnswer > 0) {
        this.currentAnswer = this.currentAnswer - 1;
      }
      this.getAnswer(this.answerIds[this.currentAnswer]);
    },
    getAnswer(aid: string) {
      let _this = this;
      axios
        .get(
          `https://api.stackexchange.com/2.2/answers/${aid}?site=stackoverflow&filter=withbody`
        )
        .then(function(response: any) {
          _this.answer = response.data.items[0].body;
          _this.wrapAnswer = response.data.items[0].body;
          _this.userInfo = {
            reputation: response.data.items[0].owner.reputation,
            creationDate: response.data.items[0].creation_date,
            profileImage: response.data.items[0].owner.profile_image,
            displayName: response.data.items[0].owner.display_name,
            userLink: response.data.items[0].owner.link,
            answerScore: response.data.items[0].score
          };
        });
    },
    copyToClipboard: function(event: any) {
      var text = event.path[2].getElementsByTagName("code")[0].innerText;
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.snackbarText = "Copied To Clipboard";
      this.snackbar = true;
    },
    parseDate: function(timestamp: any) {
      var a = new Date(timestamp * 1000);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      var year = a
        .getFullYear()
        .toString()
        .substr(-2);
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var time =
        month + " " + date + " '" + year + " " + " at " + hour + ":" + min;

      return time;
    },
    insertToWorkspace: function(event: any) {
      var text = event.path[2].getElementsByTagName("code")[0].innerText;
      // send text to vscode
      this.vscode.postMessage({ type: "insert", text: text });
      this.snackbarText = "Inserted To TextEditor";
      this.snackbar = true;
    },
    isFavorite: function(question_id: Number) {
      return this.favorites.includes(question_id);
    }
  },
  mounted() {
    // this.vscode = acquireVsCodeApi();
  },
  beforeUpdate() {
    let _this = this;
    if (this.answer != null) {
      var tmp = this.answer;
      this.answer = tmp
        .replace(
          new RegExp("<pre><code>", "g"),
          "<div class='card-raw-html'><div id='btn-id' id='copy-btn' class='copy-insert-btn'><button id='copy-btn' type='button' class='check v-btn v-btn--contained theme--dark v-size--small' style='margin-right:10px;'>Copy</button><button id='insert-btn' type='button' class='check v-btn v-btn--contained theme--dark v-size--small'>Insert</button></div><pre style='white-space: pre-wrap;'><code>"
        )
        .replace(new RegExp("</code></pre>", "g"), "</code></pre></div>");
    }
  },
  updated() {
    let _this = this;
    var buttons = document.getElementsByTagName("button");
    Array.from(buttons).forEach(button => {
      if (button.id == "copy-btn") {
        button.onclick = function(e) {
          _this.copyToClipboard(e);
        };
      } else if (button.id == "insert-btn") {
        button.onclick = function(e) {
          _this.insertToWorkspace(e);
        };
      }
    });
  }
});
</script>

<style>
/* Raw HTML for answer */
.card-raw-html {
  border: 1px solid white;
  padding: 15px;
  margin: 10px;
}
.copy-insert-btn {
  float: right;
}
#copy-btn,
#insert-btn {
  bottom: 5px;
  margin-right: 5px;
}
/* END Raw HTML for answer*/

.hrTop {
  border: 1px solid lightgray;
}

.questionContainer,
.answerContainer {
  display: flex;
  margin-bottom: 10px;
  margin-top: 5px;
  border-bottom: 1px solid lightgray;
}

.questionStats {
  width: 60px;
  text-align: center;
  padding: 3px;
  margin-bottom: 5px;
  border-left: 4px solid #f48024;
}

.answerStats {
  width: 60px;
  text-align: center;
  padding: 3px;
  margin-bottom: 5px;
  border-left: 4px solid rgb(94, 186, 125);
}

.votes {
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 2px;
  color: gray;
}

.votesAnswer {
  border-radius: 3px;
  margin-top: 5px;
  padding: 2px;
  color: gray;
}

.hide-answers-button {
  background-color: rgb(94, 186, 125);
  border-radius: 3px;
  margin-top: 5px;
  padding: 2px;
  cursor: pointer;
  color: white;
}

.hide-answers-button:hover {
  background-color: #f48024;
  color: black;
}

.pagesSelection {
  border-radius: 3px;
  margin-top: 5px;
  padding: 2px;
  color: gray;
}

.votesScore {
  font-size: 16px;
}

.votesTag {
  font-size: 11px;
}

.pagesTag {
  font-size: 11px;
}

.answers {
  background-color: rgb(94, 186, 125);
  border-radius: 3px;
  padding: 2px;
  color: white;
}

.answers:hover {
  background-color: #f48024;
  cursor: pointer;
  color: black;
}

.pages {
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 2px;
  color: gray;
}

.votesScoreAnswer {
  font-size: 12px;
}

.answersScore {
  font-size: 16px;
}

.answersTag {
  font-size: 11px;
}

.questionDate1,
.answerDate1 {
  margin-left: 10px;
  color: gray;
  margin-bottom: 5px;
}

.views {
  border-radius: 3px;
  padding: 2px;
  margin-top: 10px;
  color: #f48024;
  font-size: 11px;
}

.eyeIcon {
  border-radius: 3px;
  padding: 2px;
  margin-top: 5px;
  cursor: pointer;
}

.question {
  width: auto;
  margin-left: 20px;
  display: flex;
  justify-content: left;
  align-items: top;
  word-break: break-word;
  padding-top: 5px;
  font-size: 0.9rem;
  color: #007acc;
}

.questionBody,
.answerBody {
  color: gray;
  width: auto;
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: top;
  word-break: break-word;
  padding-top: 5px;
  border-top: 1px solid gray;
}
.tags {
  font-size: 11px;
  margin-left: 20px;
}

.tagOne {
  padding: 3px;
  color: rgb(57, 115, 157);
}

.userInfoQuestion,
.userInfoAnswer {
  margin-top: 15px;
  margin-bottom: 10px;
  margin-left: 20px;
  font-size: 11px;
  width: 170px;
  position: static;
  display: block;
}

.questionDate,
.answerDate {
  color: gray;
}

.userImage {
  height: 32px;
  width: 32px;
  display: flex;
}

.userName {
  margin-left: 7px;
  text-align: left;
  color: rgb(57, 115, 157);
}

.userReputation {
  color: gray;
  width: 120px;
}

.answers-btn {
  background-color: white;
}

.n-answers-btn {
  position: absolute;
  right: 20px;
}

.p-answers-btn {
  position: absolute;
  left: 20px;
}

.hide-answers-button {
  display: flex;
  justify-content: center;
}

.answer-pages {
  padding-bottom: 50px;
}
</style>
