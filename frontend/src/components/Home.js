import React, { Component } from "react";
import Web3 from "web3";
import { abi } from "../config";
import { address } from "../config";
import { Web3Storage } from  'web3.storage/dist/bundle.esm.min.js';
//import { v4 as uuidv4 } from 'uuid';
import "./style.css"
require('dotenv').config()
console.log("i am here")
//console.log(process.env.REACT_APP_WEB3_API_KEY)
class Home extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };
  async storeFiles () {
    /*const ext = file.name.split('.').pop();
        const fileName = '${uuidv4()}.${ext}';
        const newFile = new File([file], fileName, {type: file.type});
        const cid = await this.client.put([newFile], {
            name: fileName,
        });*/
    //console.log("kkk")
    //let x=[new File(files)]
    //console.log(x)
    let file=this.state.Buffer
    let blob=new Blob([file],{type:'image/png'})
    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_API_KEY })
    let cid = await client.put([new File([blob],"image.png")])
    console.log(cid)
    //my(this.state.values["text"],cid+".ipfs.w3s.link/image.png")
    //return cid
    cid=cid+".ipfs.w3s.link/image.png"
    console.log(cid)
    this.addPost(this.state.values["text"],cid)
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };
  async loadBlockchainData(){
    const web3=window.web3
    const accounts= await web3.eth.getAccounts()
    this.setState({account:accounts[0]})
    const networkId=await web3.eth.net.getId()
    if(networkId===5){
      const socialdapp = new web3.eth.Contract(abi, address);
      this.setState({socialdapp:socialdapp})
      const postsCount=await socialdapp.methods.countPosts().call()
      this.setState({postsCount})
      console.log(postsCount)
      console.log(socialdapp.methods)
      let posts=[]
      for(var i=0;i<postsCount;i++){
        const post=await socialdapp.methods.getPost(i).call()
        console.log(post)
        //let z={}
        let x=[]
        for(var j=0;j<post[4].length;j++){
          let z=[]
          z[0]=post[4][j]
          z[1]=post[5][j]
          x.push(z)
        }
        post[6]=x
        post[7]=i
        console.log(post)
        posts.push(post)
        console.log(post[6])
      }
      this.setState({posts})
      console.log(posts)
    }else{
      window.alert('Decentragram contract not deployed to detected network.')
    }
  };
  addPost(a,b) {
    console.log(a)
        if(a.localeCompare('')==0){
        a="none"
        }
        if(b.localeCompare('')==0){
        let b="empty post"}
        console.log("indifefeafa")
        console.log(a,b)
        console.log(this.state.socialdapp)
        this.state.socialdapp.methods.addPost(a,b).send({from:this.state.account}).on('transactionHash', (hash) => {
            console.log(hash)
        })
    }
  addComment(u,v){
    console.log("commentsinside")
    this.state.socialdapp.methods.addComment(parseInt(u),v).send({from:this.state.account}).on('transactionHash', (hash) => {
      console.log(hash)
    })
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      posts: [],
      comments:{},
      socialdapp:null,
      loading: true,
      values:{},
      cvalues:{},
      x:'',
      i:0,
      cid:'',
      visible:0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCha = this.handleCha.bind(this);
    this.handleSub = this.handleSub.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }
  captureFile(event) {
    //console.log(event)
    event.preventDefault()
    const file = event.target.files[0]
    console.log(event.target.files)
    console.log(event.target.files[0])
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      console.log("pp")
      console.log(reader.result)
      this.setState({Buffer:(reader.result)})
      
    }
    console.log(this.state.Buffer)
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(value)
    this.setState(prevState=>{
        let oldvalues=prevState.values
        oldvalues[name]=value
        return{
            values:oldvalues
        }
    })
    console.log(this.state.values["image"])
    console.log(this.state.values)
  }
  handleCha(y,e){
    console.log("insdie")
    console.log(y,e.target.value)
    const f=e.target.value
    //alert(event.target.value);
    this.setState(prevState=>{
      let oldcvalues=prevState.cvalues
      oldcvalues[y]=f
      return{
          cvalues:oldcvalues
      }
    })
  
    console.log(this.state.cvalues)
  }
  handleSub(event){
    let y=Object.keys(this.state.cvalues)
    let x=y[0]
    if(this.state.cvalues[y].localeCompare('')==0){
      alert("empty comment")
    }
    else{
      console.log("here")
      this.addComment(x,this.state.cvalues[x]);
    }
    console.log("fck u jalapati")
    console.log(this.state.cvalues)
    event.preventDefault();
  }
  handleSubmit(event) {
    if(this.state.values["text"].localeCompare('')==0){
        alert("empty post")
    }
    else{
      console.log("h")
      console.log(this.state.Buffer)
      if(this.state.Buffer!=undefined){
        console.log("herer")
        this.storeFiles()
      }
      else{
        console.log(this.state.values["image"])
        console.log("sahdadadada")
        this.addPost(this.state.values["text"],'')
      }
    event.preventDefault();
  }
  }
  async newComment() {
    const comment = prompt("What is the comment ?")
    // if (comment && comment.length > 0) {
    //   this.props.sendComment(this.props.value.postId, comment)
    // }      
    // console.log(this.state.socialdapp)
    //     this.state.socialdapp.methods.addComment(comment).send({from:this.state.account}).on('transactionHash', (hash) => {
    //         console.log(hash)
    //     })
  }
  

  render(){
  return (
    <div className="container home pt-3 ml-5" style={{ height: "100vh" }}>
       <form onSubmit={this.handleSubmit}>
            <div className="form-group w-75">
                <label for="post">post
                    <textarea name="text" className="form-control w-100" id="post" rows="2" onChange={this.handleChange}/>
                </label>
                <br/>
                <br/>
                <label for="post">
                    <input type="file" name="image" accept=".png, .jpg, .jpeg" onChange={this.captureFile}/>
                </label>
                <br/>
                <br/>
            </div>
            <button type="submit"  className="btn btn-primary mb-2">add Post</button>
        </form>
        {
        this.state.posts.map(post=><div className="card mt-5 w-100 shadow-lg">
                <div className="card-header bg-light text-success">
                    {post[2]}
                </div>
                <div className="card-body">
                    <p>{post[0]}</p>
                    {
                      post[1].indexOf('.ipfs.w3s.link/image.png')!=-1&&
                      <div class="embed-responsive embed-responsive-21by9">
                    <img src={"https://"+post[1]} alt="" style={{height:"800px",width:"800px"}} ></img></div>
                   }
                </div>
                <div className="card-footer">
                  <p className="fst-italic">comments</p>{
                  post[6].map((x)=>
                  <div className="card mt-3 w-100">
                        <div className="card-header bg-light text-success">
                            {x[1]}
                        </div>
                        <div className="card-body">
                            <p>{x[0]}</p>
                        </div>
                  </div>
                  )}
                  <div>
                    <form onSubmit={this.handleSub}>
                        <div className="form-group w-75">
                            <label for="post">comment:
                                <input type="text" className="form-control w-100" onChange={this.handleCha.bind(this,post[7])}/>
                            </label>
                        </div>
                        <button type="submit"  className="btn btn-primary mb-2 mt-3">add comment</button>
                    </form>
                  </div>
                </div>
            </div>)
        }
    </div>
  );
}
}
export default Home;