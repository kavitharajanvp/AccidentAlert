
 
(function() {
    'use strict';

    const ABI = [{"outputs":[{"name":"age","type":"uint8"},{"name":"user_details","type":"bytes32[]"}],"constant":true,"inputs":[{"name":"_vehicle_no","type":"string"}],"name":"vehicleInfo","stateMutability":"view","type":"function"},{"outputs":[{"name":"_total_users","type":"uint256"},{"name":"_total_reports","type":"uint256"}],"constant":true,"name":"contractInfo","stateMutability":"view","type":"function"},{"outputs":[{"name":"id","type":"uint256"},{"name":"dob","type":"uint40"},{"name":"age","type":"uint8"},{"name":"user_details","type":"bytes32[]"}],"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"userInfo","stateMutability":"view","type":"function"},{"outputs":[{"name":"id","type":"uint256"},{"name":"justification","type":"string"},{"name":"location","type":"string"},{"name":"pic1","type":"string"},{"name":"accident_date","type":"string"},{"name":"vehicle_no","type":"string"},{"name":"points","type":"uint256"},{"name":"reportedby","type":"address"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"accidents","stateMutability":"view","type":"function"},{"inputs":[{"name":"_cp_name","type":"string"},{"name":"_cp_relation","type":"string"},{"name":"_cp_email","type":"string"},{"name":"_cp_mobile_no","type":"string"}],"name":"updatecontact","stateMutability":"nonpayable","type":"function"},{"outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"points","type":"uint256"},{"name":"total_accident","type":"uint256"},{"name":"total_report","type":"uint256"}],"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"userTotalInfo","stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_vehicle_no","type":"string"},{"name":"_mobile_no","type":"string"},{"name":"_cp_name","type":"string"},{"name":"_cp_mobile_no","type":"string"}],"name":"signup","stateMutability":"nonpayable","type":"function"},{"outputs":[{"type":"address"}],"constant":true,"name":"owner","stateMutability":"view","type":"function"},{"outputs":[{"type":"address"}],"constant":true,"inputs":[{"type":"string"}],"name":"vehicles","stateMutability":"view","type":"function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"accident_points","stateMutability":"view","type":"function"},{"outputs":[{"name":"id","type":"uint256"},{"name":"points","type":"uint256"},{"name":"total_accidents","type":"uint256"},{"name":"total_reports","type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"users","stateMutability":"view","type":"function"},{"inputs":[{"name":"_address1","type":"string"},{"name":"_address2","type":"string"},{"name":"_city","type":"string"},{"name":"_pincode","type":"string"},{"name":"_state","type":"string"},{"name":"_country","type":"string"}],"name":"updateaddress","stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_mobile_no","type":"string"},{"name":"_dob","type":"uint40"},{"name":"_age","type":"uint8"},{"name":"_gender","type":"string"},{"name":"_blood_group","type":"string"},{"name":"_email","type":"string"},{"name":"_rc_book","type":"string"}],"name":"updateprofile","stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_newname","type":"string"}],"name":"signup1","stateMutability":"nonpayable","type":"function"},{"outputs":[{"name":"result","type":"bytes32"}],"constant":true,"inputs":[{"name":"source","type":"string"}],"name":"stringToBytes32","stateMutability":"pure","type":"function"},{"outputs":[{"name":"id","type":"uint256[]"},{"name":"points","type":"uint256[]"},{"name":"others","type":"bytes32[5][]"}],"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"userReportInfo","stateMutability":"view","type":"function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"total_users","stateMutability":"view","type":"function"},{"outputs":[{"type":"address"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"addresses","stateMutability":"view","type":"function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"total_accidents","stateMutability":"view","type":"function"},{"inputs":[{"name":"_justification","type":"string"},{"name":"_location","type":"string"},{"name":"_accident_date","type":"string"},{"name":"_vehicle_no","type":"string"}],"name":"report","stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"indexed":true,"name":"reportedby","type":"address"},{"name":"vehicle_no","type":"string"},{"name":"accident_date","type":"string"},{"name":"loc","type":"string"}],"name":"AccidentReported","type":"Event"},{"inputs":[{"indexed":true,"name":"reportedby","type":"address"},{"name":"vehicle_no","type":"string"},{"name":"accident_date","type":"string"},{"name":"loc","type":"string"},{"name":"cpname","type":"string"},{"name":"cpmobileno","type":"string"}],"name":"AccidentReportedWithContact","type":"Event"}];


    let contract, odometer;

    

    let VueTRON = {
        data() {
            return {
                tron: { 
                    tronWeb: false,
                    auth: false,
                    account: ''
                }
            };
        },
        created() {
            let self = this,
                tries = 0;

            setTimeout(function initTimer() {
                if(!window.tronWeb) return ++tries < 50 ? setTimeout(initTimer, 100) : null;

                self.tron.tronWeb = !!window.tronWeb;

                window.tronWeb.on('addressChanged', function() {
                    self.tron.account = window.tronWeb.defaultAddress.base58;
				this.updateInfo();	
                });

                setTimeout(function chechAuth() {
                    self.tron.auth = window.tronWeb && window.tronWeb.ready;
                    if(!self.tron.auth) setTimeout(chechAuth, 200);
                    else self.tron.account = window.tronWeb.defaultAddress.base58;
                }, 200);
            }, 100);
        },
        methods: {
            getTronWeb() {
                return new Promise((resolve, reject) => {
                    window.tronWeb ? resolve(window.tronWeb) : reject('TronWeb not found');
                });
            },
            awaitTx(tx) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 8000);
                });
            }
        }
    };
	
    // Main
    new Vue({
        mixins: [VueTRON],
        el: '#App',
       data: {
            tab: 'main',
            contract_address: 'TFTZDS4NGnBy7cjgUHPCnxm2wNQzMJSyLx',
			username: '',
			vehicle_no: '',
			mobile_no: '',
			dob: 0,
			age: 0,
			gender: '', 
			blood_group: '',
			email: '',
			address1: '',
			address2: '',
			city: '',
			pincode: '',
			state: '',
			country: '',
			rc_book: '',
			profile_pic: '',
			cp_name: '',
			cp_relation: '',
			cp_email: '',
			cp_mobile_no: '',
			justification: '',
			loc: '', 
			pic1: '',
			accident_date: '',
			vehicle_no: '',
            contract: {
		balance: 0,
                total_users: 0,
                total_reports: 0,
            },
	   searchresult: {
		vehicleno: '',
		username: '',
		age: 0,
		blood_group: '',
		cpname: '',
		cpemail: '',
		cpmobileno: ''
            },	       
	   upmodal: {
                show: false,
		username: '',
		vehicleno: '',
		mobileno: '',
		cpname: '',
		cpmobileno: ''
            },
	   upmodal1: {
                show: false,
		username: '',
		mobileno: '',
		dob: '',
		age: 0,
		gender: '',
	   	blood_group: '',
		email: ''
            },
	   upmodal2: {
                show: false,
		address1: '',
		address2: '',
		city: '',
		pincode: '',
		state: '',
		country:''
            },
	   upmodal3: {
                show: false,
		cp_name: '',
		cp_relation: '',
		cp_email: '',
		cp_mobileno: ''
            },  	       
	   upmodal4: {
                show: false,
		justification: '',
		loc: '',
		accident_date: '',
		vehicle_no: ''
            },  
	       
            user: {
		     	balance: 0,
			id: 0,
                	username: '',
			vehicle_no: '',
			mobile_no: '',
			dob: '',
			age: 0,
			gender: '', 
			blood_group: '',
			email: '',
			address1: '',
			address2: '',
			city: '',
			pincode: '',
			state: '',
			country: '',
			rc_book: '',
			profile_pic: '',
			cp_name: '',
			cp_relation: '',
			cp_email: '',
			cp_mobile_no: '',
			total_accidents: 0,
			total_reports: 0,
			total_points: 0,
		        total_amount: 0,

			accident_info: [ {id: 0, accident_date: 0, justification: '', loc: '', pic1: '', vehicle_no: ''} ],
			report_info: []
            }
	  
			
        },
        mounted() {
            if(!document.cookie.match(/coopolice=1/)) {
                this.notice('This website uses cookies for functionality, analytics and advertising purposes as described in our Privacy Policy. If you agree to our use of cookies, please continue to use our site.<br/><br/><a href="javascript:void()" style="color:#fff; text-decoration:none"><b>OK</b></a>', '00aba9', 0)
                .then(() => { document.cookie = 'coopolice=1; Max-Age=31536000; path=/'; });
            }
		
            $(window).on('focus', () => {
                this.updateInfo();
            });
        },
        watch: {
            'tron.account'() {
                this.getTronWeb().then(tronWeb => {
                    contract = tronWeb.contract(ABI, tronWeb.address.toHex(this.contract_address));
                    this.updateInfo();
                });
            },
            'contract.total_users'() {
                if(!odometer) {
                    odometer = new Odometer({
                        el: this.$refs.odometer,
                        format: '',
                        theme: 'digital'
                    });
                }
		   
		odometer.update(parseInt(this.user.total_points));
                
            }
        },
        methods: {
            // colors: primary = 007eff; success = 4caf50; warning = fb8c00; error = e53935
            notice(msg, color = '007eff', time = 3000) {
                return new Promise((resolve, reject) => {
                    let wrap = $('<div style="box-sizing:border-box; position:fixed; left:calc(50% - 160px); box-shadow:0 5px 25px rgba(0,0,0,0.2); width:320px; top:40px; background:#' + (color ? color : '007eff') + '; border-radius:10px; color:#fff; padding:20px 20px; text-transform:none; font:16px/1.2 Tahoma, sans-serif; cursor:pointer; z-index:999999; text-align:center;">' + msg + '</div>')
                        .on('click', () => { wrap.remove(); resolve(); })
                        .appendTo('body');
                    if(time > 0) setTimeout(() => { wrap.remove(); }, time);
                });
            },
            copyText(value) {
                let s = document.createElement('input');
                s.value = value;
                document.body.appendChild(s);

                if(navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    s.contentEditable = true;
                    s.readOnly = false;
                    let range = document.createRange();
                    range.selectNodeContents(s);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    s.setSelectionRange(0, 999999);
                }
                else s.select();

                try { document.execCommand('copy'); this.notice('Copied!', '4caf50'); }
                catch (err) { this.notice('Copy error', 'e53935'); }

                s.remove();
            },
            safe(value) {
                return this.tron.account ? value : '---';
            },
	   updateInfo() {
		   this.getTronWeb().then(tronWeb => {
		  	tronWeb.trx.getBalance(this.tron.account).then(balance => {
                        	this.user.balance = parseInt(tronWeb.fromSun(balance));
				
                    	});  
		
		   contract.contractInfo().call().then(res => {
                        this.contract.total_users = parseInt(res._total_users);
		   	this.contract.total_reports = parseInt(res.total_reports);
                    });
			   
			contract.userTotalInfo(this.tron.account).call().then(res => {
				this.user.total_accidents = parseInt(res.total_accident);
				this.user.total_reports = parseInt(res.total_report);
				this.user.total_points = parseInt(res.points);
				
				this.user.total_amount =  Math.trunc(parseInt(res.points) / 50) * 500;;
				if(odometer)
				odometer.update(parseInt(this.user.total_points));
                    });
		
                    contract.userInfo(this.tron.account).call().then(res => {
			    
			var dt = new Date(parseInt(res.dob) * 1000);
					
			var dd = String(dt.getDate()).padStart(2, '0');
			var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = dt.getFullYear();
					

					
			var rd	= String(dt.getDate()).padStart(2, '0') + '/' + 
					String(dt.getMonth() + 1).padStart(2, '0') + '/' + 
					dt.getFullYear();
			this.upmodal1.dob = this.user.dob = rd;
			this.user.id = parseInt(res.id);
			this.user.age = parseInt(res.age);
			this.upmodal1.username = this.user.username = tronWeb.toUtf8(res.user_details[0]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal1.gender = this.user.gender = tronWeb.toUtf8(res.user_details[1]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal1.blood_group = this.user.blood_group = tronWeb.toUtf8(res.user_details[2]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal1.email = this.user.email = tronWeb.toUtf8(res.user_details[3]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal1.mobileno = this.user.mobile_no = tronWeb.toUtf8(res.user_details[4]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal2.address1 = this.user.address1 = tronWeb.toUtf8(res.user_details[5]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal2.address2 = this.user.address2 = tronWeb.toUtf8(res.user_details[6]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal2.city = this.user.city = tronWeb.toUtf8(res.user_details[7]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal2.pincode = this.user.pincode = tronWeb.toUtf8(res.user_details[8]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal2.state = this.upmodal2.state = this.user.state = tronWeb.toUtf8(res.user_details[9]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal2.country = this.user.country = tronWeb.toUtf8(res.user_details[10]).replace(/[^\x20-\x7E]/g, '');
			this.user.vehicle_no = tronWeb.toUtf8(res.user_details[12]).replace(/[^\x20-\x7E]/g, '');
		    	this.user.rc_book = tronWeb.toUtf8(res.user_details[13]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal3.cp_name = this.user.cp_name = tronWeb.toUtf8(res.user_details[14]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal3.cp_relation = this.user.cp_relation = tronWeb.toUtf8(res.user_details[15]).replace(/[^\x20-\x7E]/g, '');
			this.upmodal3.cp_email =this.user.cp_email = tronWeb.toUtf8(res.user_details[16]).replace(/[^\x20-\x7E]/g, '');
		    	this.upmodal3.cp_mobileno = this.user.cp_mobile_no = tronWeb.toUtf8(res.user_details[17]).replace(/[^\x20-\x7E]/g, '');
			    
			    
                    });
			   
			contract.userReportInfo(this.tron.account).call().then(res => {
				this.user.report_info =[];
				for(var i=0;i<this.user.total_reports;i++) {
					if(!this.user.report_info[i])
       						 this.user.report_info[i] = [];
					
					//var dt = new Date(parseInt(res.report_date[i+1]) * 1000);
					
					//var dd = String(dt.getDate()).padStart(2, '0');
					//var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
					//var yyyy = dt.getFullYear();
					

					
					//var rd	= String(dt.getDate()).padStart(2, '0') + '/' + 
							//String(dt.getMonth() + 1).padStart(2, '0') + '/' + 
							//dt.getFullYear();
					

					this.user.report_info[i][0] = parseInt(res.id[i+1]) ;
					//this.user.report_info[i][1] = rd;
					this.user.report_info[i][1] = tronWeb.toUtf8(res.others[i+1][4]).replace(/[^\x20-\x7E]/g, '');;
					this.user.report_info[i][2] = parseInt(res.points[i+1]) ;
					this.user.report_info[i][3] = tronWeb.toUtf8(res.others[i+1][0]).replace(/[^\x20-\x7E]/g, '');
					this.user.report_info[i][4] = tronWeb.toUtf8(res.others[i+1][1]).replace(/[^\x20-\x7E]/g, '');
					this.user.report_info[i][5] = tronWeb.toUtf8(res.others[i+1][3]).replace(/[^\x20-\x7E]/g, '');
					
					this.upmodal.show = false;
					this.upmodal1.show = false;
					this.upmodal2.show = false;
					this.upmodal3.show = false;
					this.upmodal4.show = false;
				}							
                    });
			   
		 });
	   },
	signup(username, vehicle_no, mobile_no, cp_name, cp_mobile_no) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
                if(this.user.balance < 0.1) return this.notice('To process you need to have TRX in your wallet.<br/>If you just received funds to your wallet, wait 1 minute for network confirmation and try again', 'fb8c00');

			if(username && vehicle_no && mobile_no && cp_name && cp_mobile_no)
			{
				
			   	this.username = username;
				this.vehicle_no = vehicle_no;
				this.mobile_no = mobile_no;
				this.cp_name = cp_name;
				this.cp_mobile_no = cp_mobile_no;
				//this.dob = parseInt((new Date(cp_mobile_no)).getTime() / 1000);   
						
				this.getTronWeb().then(tronWeb => {
					contract.signup(this.username, this.vehicle_no, this.mobile_no, this.cp_name, this.cp_mobile_no).send().then(tx => {
						this.notice('Transaction was successfully sent. Wait confirming..', '4caf50');
						this.awaitTx(tx).then(() => {
							this.updateInfo();
							
						});
					});
				});
			} else return this.upmodal.show = true;
            },	
	search(vehicle_no) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
		if(vehicle_no)
		{
			this.getTronWeb().then(tronWeb => {
				contract.vehicleInfo(vehicle_no).call().then(res => {
					this.searchresult.age = parseInt(res.age);
					this.searchresult.username = tronWeb.toUtf8(res.user_details[0]).replace(/[^\x20-\x7E]/g, '');
					this.searchresult.blood_group = tronWeb.toUtf8(res.user_details[1]).replace(/[^\x20-\x7E]/g, '');
					this.searchresult.cpname = tronWeb.toUtf8(res.user_details[2]).replace(/[^\x20-\x7E]/g, '');
					this.searchresult.cpemail  = tronWeb.toUtf8(res.user_details[3]).replace(/[^\x20-\x7E]/g, '');
					this.searchresult.cpmobileno  = tronWeb.toUtf8(res.user_details[4]).replace(/[^\x20-\x7E]/g, '');
				    });
			});
		};
            },		
            updateprofile(username,mobile_no,dob,age,gender,blood_group,email) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
                if(this.user.balance < 0.1) return this.notice('To process you need to have TRX in your wallet.<br/>If you just received funds to your wallet, wait 1 minute for network confirmation and try again', 'fb8c00');
         
			if(username && mobile_no )
			{
				this.username = username;
				this.mobile_no = mobile_no;
				this.dob = parseInt((new Date(dob)).getTime() / 1000); 
				this.age = age;
				this.gender = gender;
				this.blood_group = blood_group;
				this.email = email;
				this.rc_book = '';

				this.getTronWeb().then(tronWeb => {
					contract.updateprofile(this.username,this.mobile_no,this.dob,this.age,this.gender,this.blood_group,this.email,this.rc_book).send().then(tx => {
						this.notice('Transaction was successfully sent. Wait confirming..', '4caf50');
						this.awaitTx(tx).then(() => {
							this.updateInfo();
						});
					});
				});
		    } else return this.upmodal1.show = true;
            },
   	 updateaddress(address1,address2,city,pincode,state,country) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
                if(this.user.balance < 0.1) return this.notice('To process you need to have TRX in your wallet.<br/>If you just received funds to your wallet, wait 1 minute for network confirmation and try again', 'fb8c00');
         
			if(address1 && pincode )
			{
				
				this.address1 = address1;
				this.address2 = address2;
				this.city = city;
				this.pincode = pincode;
				this.state = state;
				this.country = country;
				this.getTronWeb().then(tronWeb => {
					contract.updateaddress(this.address1,this.address2,this.city,this.pincode,this.state,this.country).send().then(tx => {
						this.notice('Transaction was successfully sent. Wait confirming..', '4caf50');
						this.awaitTx(tx).then(() => {
							this.updateInfo();
						});
					});
				});
			} else return this.upmodal2.show = true;
            },		
           updatecontact(cp_name,cp_relation,cp_email,cp_mobile_no) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
                if(this.user.balance < 0.1) return this.notice('To process you need to have TRX in your wallet.<br/>If you just received funds to your wallet, wait 1 minute for network confirmation and try again', 'fb8c00');
			if(cp_name && cp_mobile_no )
			{
				this.cp_name = cp_name;
				this.cp_relation = cp_relation;
				this.cp_email = cp_email;
				this.cp_mobile_no = cp_mobile_no;

				this.getTronWeb().then(tronWeb => {
					contract.updatecontact(this.cp_name,this.cp_relation,this.cp_email,this.cp_mobile_no).send().then(tx => {
						this.notice('Transaction was successfully sent. Wait confirming..', '4caf50');
						this.awaitTx(tx).then(() => {
							this.updateInfo();
						});
					});
				});
			} else return this.upmodal3.show = true;
            },
           report(justification,loc,accident_date,vehicle_no) {
                if(!this.tron.account) return this.notice('To process you need to use the Tron wallet.', 'fb8c00');
                if(this.user.balance < 0.1) return this.notice('To process you need to have TRX in your wallet.<br/>If you just received funds to your wallet, wait 1 minute for network confirmation and try again', 'fb8c00');
         
		if(justification && loc && accident_date)
		{	   
				this.justification = justification;
				this.loc= loc; 
				this.pic1= '';
				//this.accident_date =  parseInt((new Date(accident_date)).getTime() / 1000); 
				this.accident_date =  accident_date;
				this.vehicle_no = vehicle_no;
			
				this.getTronWeb().then(tronWeb => {
					contract.report(this.justification,this.loc,this.accident_date,this.vehicle_no).send().then(tx => {
						this.notice('Transaction was successfully sent. Wait confirming..', '4caf50');
						this.awaitTx(tx).then(() => {
							this.updateInfo();
						});
					});
				});
		   } else return this.upmodal4.show = true;
            }
           
	}
          
    });
})();
