import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateState } from './../../redux/actions';
import options from './../../config/options';
import StartButton from './StartButton';
import Form from './Form';
import './landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    let startLink = `/quiz/${props.optionIndex}`;
    startLink = props.optionIndex < options.length ? startLink : '/results';
    this.state = { startLink };
  }

  render() {
    const { startLink } = this.state;
    return (
      <section className="landing-wrapper">
        <h1>Two Types of People</h1>
        <p className="">
          There are many different types of people and personalities
          in this world. However, it's sometimes easiest to divide us
          into two specific groups. Find out your personality type as
          you take this simple and fun quiz.
        </p>
        <p>
          Portuguese art director Joao Rocha has created a fun
          <a href="http://2kindsofpeople.tumblr.com/" target="_blank" rel="noopener noreferrer"> series </a>
          of minimalist illustrations that classifies people into two broad groups based
          on their daily habits and preferences.
        </p>

        <Form />
        <StartButton startLink={startLink} optionIndex={this.props.optionIndex} />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  optionIndex: state.optionIndex,
});

const mapDispatchToProps = dispatch => ({
  updateState: change => dispatch(updateState(change)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
