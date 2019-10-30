import React, { Component } from 'react';
import {  BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './index.css';
import Question from "./Question";
import QuestionList from "./QuestionList";
import NotFound from "./NotFound";
import AddQuestion from "./AddQuestion";
import AddAnswer from "./AddAnswer";
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { questions: [] }
        // this.handleChange = this.handleChange.bind(this);
        this.API_URL = window.location.href;

        this.postDataToDB = this.postDataToDB.bind(this);
        this.postAnswersToDB = this.postAnswersToDB.bind(this);
    }
    // handleChange() {
    //     console.log("test");
    // }

    async componentWillMount() {
        //await data.
        const response = await fetch(
            `http://localhost:8080/questions2`
        );

        //assign to const json and set state when we receive data
        const json = await response.json();
        this.setState({ questions: json });
    }

    postDataToDB(title, description){
        fetch(`http://localhost:8080/questions`, {
            method:'post',
              body: JSON.stringify({
                    "title": title,
                    "description": description,
                    "answers": []
                }),
            headers: new Headers({ "Content-Type": "application/json" }) // add headers

    })
            //.then(response => response.json())
    }
    postAnswersToDB(text, id){
        fetch("http://localhost:8080/questions/:id/answers",{
            method: 'put',
            body: JSON.stringify({
                "originalPostId": id,
                "answer": text,
            }),
            headers: new Headers({ "Content-Type": "application/json" }) // add headers

        })
            // .then(response => response.json())
    }
    updateRating(ranking, id, originalPostId, text){
        fetch('http://localhost:8080/questions/:id/rating', {
            method:'put',
            body:JSON.stringify({
                "originalAnswerId": id,
                "ranking": parseInt(ranking),
                "originalPostId":originalPostId,
                "text":text,
            }),
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        })

            // .then(response=> response.json())
        //             // .then(response => console.log(response.json))
    }
    // putDataToDB = (title,description) => {
    //     let currentIds = this.state.questions.map(questions => questions.id);
    //     let idToBeAdded = 0;
    //     while (currentIds.includes(idToBeAdded)) {
    //         ++idToBeAdded;
    //     }
    //
    //     axios.post("http://localhost:8080/questions2", {
    //         id: idToBeAdded,
    //         title: title,
    //         description: description
    //     });
    // };

   
    async getQuestionFromId(id) {
               //await data.
               const response = await fetch(
                `http://localhost:8080/questions2`
            );
    
            //assign to const json and set state when we receive data
            const json = await response.json();
            this.setState({ questions: json });
            return this.state.questions.find((elm) => Number(elm.id) === Number(id));
    }
    render() {
        var questions = this.state.questions;
        console.log(this.state.questions);
        return (
            <Router>
                <div className="container">
                    <h1>StackOverflow</h1>
                    <Switch>
                    <Route exact path={'/'}
                            render={(props) =>
                                <QuestionList {...props}
                                    questions={questions}
                                    header={'Questions Asked'} postDataToDB={this.postDataToDB} form={this.postDataToDB}/>



                            }
                        />

                        <Route exact path={'/question/:id'}
                            render={(props) => <Question {...props}
                                questionsID={props.match.params.id} postAnswersToDB={this.postAnswersToDB}
                            updateRating={this.updateRating.bind(this)}/>

                            }
                        />

                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
