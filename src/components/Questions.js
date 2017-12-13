import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import Results from './Results';
import options from './../options';
import colors from './../colors';
import getContrast from './../utils/getContrast';
import firebase from './../firebase.js';
import repeatArray from './../utils/repeatArray';
import Item from './Item';

export default class Questions extends Component {
  state = {
    choices: 0, optionIndex: 0, opt: '', sideEl: null,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.useArrows);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.useArrows);
  }

  getRefOne = (ref) => { this.one = ref; }
  getRefTwo = (ref) => { this.two = ref; }

  useArrows = (e) => {
    const item = options[this.state.optionIndex];
    if (e.key === 'ArrowLeft') {
      this.selectItem('one', item[0])();
    } else if (e.key === 'ArrowRight') {
      this.selectItem('two', item[1])();
    }
  }

  selectItem = (ref, opt) => () => {
    const sideEl = this[ref];
    let option;
    if (ref === 'one') {
      option = this.color.option1;
      this.two.children[0].style.boxShadow = '';
    } else {
      option = this.color.option2;
      this.one.children[0].style.boxShadow = '';
    }
    const color = getContrast(option) === '#ededed' ? '255,255,255' : '0,0,0';
    sideEl.children[0].style.boxShadow = `0px 0px 10px 4px rgba(${color},0.9)`;
    this.setState({ opt, sideEl });
  }

  handleNext = () => {
    const { opt, sideEl } = this.state;
    // sideEl.classList.add('big');
    this.recordItem(opt);
    this.updateOptionIndex(sideEl);
    this.two.children[0].style.boxShadow = '';
    this.one.children[0].style.boxShadow = '';
  }

  recordItem = (option) => {
    const itemRef = firebase.database().ref(`choices/${this.state.optionIndex}`);
    itemRef.transaction((opts) => {
      const currentItem = opts || { option1: 0, option2: 0 };
      return {
        option1: option === 1 ? (currentItem.option1 || 0) + 1 : currentItem.option1,
        option2: option === 2 ? (currentItem.option2 || 0) + 1 : currentItem.option2,
      };
    });
    this.setState(prev => ({ choices: prev.choices + option }));
  }

  updateOptionIndex = () => {
    // setTimeout(() => {
    // document.body.style.background = next;
    // el.classList.remove('big');
    this.setState(prev => ({ optionIndex: prev.optionIndex + 1, sideEl: null, opt: '' }));
    // }, 500);
  }

  render() {
    const { choices, optionIndex, sideEl } = this.state;
    if (optionIndex > options.length - 1) {
      return <Results choices={choices} />;
    }
    const item = options[optionIndex];
    const theColors = repeatArray(colors, options.length);
    this.color = theColors[optionIndex];
    const color1 = getContrast(this.color.option1);
    const color2 = getContrast(this.color.option2) === '#ededed' ? ' white' : '';
    return (
      <React.Fragment>
        <header>
          <Link to="/">
            <h1 style={{ color: color1 }}>
              Two Types of People
            </h1>
          </Link>
          <button
            className={`my-button next${color2}${sideEl ? '' : ' blocked'}`}
            onClick={this.handleNext}
          >
            <span>Next </span>
            <span className="hovering">&rarr;</span>
          </button>
        </header>
        <section className="quiz-wrapper">
          <Item
            option={this.color.option1}
            getRef={this.getRefOne}
            item={item[0]}
            color={color1 === '#ededed' ? ' white' : ''}
            selectItem={this.selectItem}
            number="one"
          />
          <div className="vertical-line" />
          <Item
            option={this.color.option2}
            getRef={this.getRefTwo}
            item={item[1]}
            color={color2}
            selectItem={this.selectItem}
            number="two"
            render={(
              <button className={`my-button see-stats${color2}`}>
                See Stats
              </button>
            )}
          />
        </section>
      </React.Fragment>
    );
  }
}