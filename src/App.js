import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { connect } from 'react-redux';
import { updateState, updateMultiple } from './redux/actions';
import Questions from './components/quiz/Questions';
import Landing from './components/landing/Landing';
import Results from './components/results/Results';
import FourOFour from './components/FourOFour';
import firebase from './config/firebase.js';
import objectToArray from './utils/objectToArray.js';

class App extends Component {
  componentDidMount() {
    const USState = localStorage.getItem('USState');
    const gender = localStorage.getItem('gender');
    const ageGroup = localStorage.getItem('ageGroup');
    const choices = localStorage.getItem('choices');
    const optionIndex = localStorage.getItem('optionIndex');
    const localStates = [];
    if (gender) {
      localStates.push({ key: 'gender', value: gender });
    }
    if (ageGroup) {
      localStates.push({ key: 'ageGroup', value: ageGroup });
    }
    if (USState) {
      localStates.push({ key: 'USState', value: USState });
    }
    if (choices) {
      localStates.push({ key: 'choices', value: choices });
    }
    if (optionIndex) {
      localStates.push({ key: 'optionIndex', value: optionIndex });
    }
    // else {
    //   this.getLocation();
    // }
    // this.getAllChoices();
    this.props.updateMultiple(localStates);
  }

  getAllChoices = () => {
    const itemsRef = firebase.database().ref('choices');
    itemsRef.on('value', (snapshot) => {
      const allData = objectToArray(snapshot.val());
      this.props.updateState({ key: 'allData', value: allData });
    });
  }

  getLocation = async () => {
    await fetch('https://freegeoip.net/json/')
      .then(response => response.json())
      .then((location) => {
        if (location.country_code === 'US' && location.region_name) {
          localStorage.setItem('USState', location.region_name);
          this.props.updateState({ key: 'USState', value: location.region_name });
        }
      });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/quiz/:optionIndex" component={Questions} />
        <Route exact path="/results" component={Results} />
        <Route exact path="/" component={Landing} />
        <Route component={FourOFour} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  allData: state.allData,
});

const mapDispatchToProps = dispatch => ({
  updateState: change => dispatch(updateState(change)),
  updateMultiple: changes => dispatch(updateMultiple(changes)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(App);
