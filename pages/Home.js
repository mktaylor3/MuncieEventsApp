import React from 'react';
import EventList from "../EventList"
import {TextInput, View, Text, ImageBackground} from 'react-native';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';
import {AppLoading} from 'expo';
import APICacher from '../APICacher';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';

export default class HomeScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={text: ''};
    this.state={url: 'https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'};
    this.state={searchurl: ""}
    this.state = {isLoading: true};
    this._startupCachingAsync = this._startupCachingAsync.bind(this);
    this.APICacher = new APICacher();
  }  

      componentDidMount(){
        this._startupCachingAsync();
      }

      render(){
        mainView = null
        /*
        if(this.state.searchurl){
            mainView = this. getSearchView();
        }
        */
        if(this.state.isLoading /*&& !this.state.searchurl*/){
          mainView = this.getLoadingScreen();
        }
        else{
            mainView = this.getHomeView();
        }
        /*
        else if(this.state.isLoading && this.state.searchurl){
          return(
            <AppLoading 
              startAsync={() => this.startSearchSequence('https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1')}
              onFinish={() => this.setState({ isReady: true })}
              onError= {console.error}
            />
          );
        }
        */
        return(
          <View style={Styles.wrapper}>
            <TopBar/>
            <View>
              {mainView}
            </View>
          </View>
          );
        }

      getLoadingScreen(){
        return(
          <View>
            <LoadingScreen/>
          </View>
        );
      }

      async _startupCachingAsync(){
          key = "APIData"
          url = "https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
          hasAPIData = await this.APICacher._hasAPIData(key)
          if(hasAPIData){
           await this.APICacher._refreshJSONFromStorage(key, url)
          }
          if(!hasAPIData){
            await this.APICacher._cacheJSONFromAPIWithExpDate(key, url);
          }
          this.setState({isLoading:false})
      }

      getHomeView(){
        return(
            <View>
              <EventList style={Styles.eventList}/>
            </View>
            )
        }

      async startSearchSequence(searchurl){
        console.log(searchurl)
        await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchurl)
      }

      getSearchView(){
        console.log(this.state.searchurl)
        return(
          <View>
            <CustomButton 
              text="Go Back"
              buttonStyle = {Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => {this.setState({searchurl: ""})}}/>
            />
              <EventList useSearchResults={true} />
          </View>
        )
      }

      async searchOnString(arbitraryString){
        await this.APICacher._cacheJSONFromAPIAsync("SearchResults", arbitraryString)
      }
  }