sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("student.project1.controller.View1", {
            onInit: function () {

                //var sUrl = oModel.sServiceUrl
                // var sUrl = "/sap/opu/odata/shl/SB_SERV_STD"
                // $.ajax({
                //    type: "GET",
                //     url: sUrl,
                //     success: function(data){
                //         var oComp = this.getOwnerComponent();
                //         var oModel = oComp.getModel("studModel");
                //         oModel.setData(data);
                //         this.getView().setModel(oModel,"stdModel");
                //         console.log(data);
                //     },
                //     error:function(err){
                //         console.log(err);
                //     }
                // })

                var that = this;
                var oComp = this.getOwnerComponent();
                var oModel = oComp.getModel("studModel");
                // 1. Here trying to call entity of RAP service to perform read operation and set data
                // to view
                // 2. Best practice is to always bind view directly with the service entity without 
                // read operation
                // 3. Incase if you want to apply filters then perform read operation on the entity 
                // and then set the filtered data to view

                // oModel.read("/xSHLxP_CDS_STD",{
                //     success: function(data,respone){
                //         // oModel.setData(data);
                //         that.getView().setModel(oModel);
                //         console.log("read success");
                //     },
                //     error:function(err){
                //         console.log(err);
                //     }

                //  })

                oModel.callFunction("/get_student_data", {
                    method: "POST",
                    urlParameters: {
                        "StdId": "00001"
                    },
                    success: function (data, respone) {
                        // oModel.setData(data);
                        that.getView().setModel(oModel, "stdModel");
                        console.log("read success");
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })


            },
            onCreate: function (oEvent) {
                var oFragment;
                if (!this.oFragment) {
                    this.oFragment = sap.ui.xmlfragment("fragID", "student.project1.fragments.CreateStudMulti", this);
                    this.getView().addDependent(this.oFragment);
                }
                this.oFragment.open();

            },

            onSave: function (oEvent) {
                var lv_stdid = sap.ui.getCore().byId('idFragStdInp').getValue();
                var lv_stdfname = sap.ui.getCore().byId('idFragFnam').getValue();
                var lv_stdlname = sap.ui.getCore().byId('idFragLnam').getValue();
                var lv_stdage = parseInt(sap.ui.getCore().byId('idFragage').getValue());
                if (!lv_stdage) {
                    lv_stdage = 0;
                }
                var lv_stdgen = sap.ui.getCore().byId('idFraggen').getValue();
                var lv_stdcrs = sap.ui.getCore().byId('idFragcrs').getValue();
                var oModel = this.getOwnerComponent().getModel('studModel');
                oModel.callFunction("/create_student_data", {
                    method: "POST",
                    urlParameters: {
                        "StdId": lv_stdid,
                        "Firstname": lv_stdfname,
                        "Lastname": lv_stdlname,
                        "Age": lv_stdage,
                        "Gender": lv_stdgen,
                        "course": lv_stdcrs
                    },
                    success: function (data, respone) {
                        console.log(respone);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            },

            onValueHelp: function (oEvent) {
                var that=this;
                if (!this.oValHelpFrag) {
                    this.oValHelpFrag = sap.ui.core.Fragment.load({
                        id:"valuehelp",
                        type:"XML",
                        name:"student.project1.fragments.ValueHelp",
                        controller: this
                    }).then(function(oFrag){
                        that.getView().addDependent(oFrag);
                        return oFrag;
                    });
                    // this.oValHelpFrag=sap.ui.xmlfragment("fragID", "student.project1.fragments.ValueHelp", this);

                    // this.getView().addDependent(this.oValHelpFrag)
            }
            // this.oValHelpFrag.open();
            this.oValHelpFrag.then(function(oFrag){oFrag.open()});

            },

            onCancel: function (oEvent) {
                if (this.oFragment) {
                    this.oFragment.close();
                }
            },
             
            onOk: function(oEvent){
            //    debugger;
                const selId=oEvent.getSource();
                var oSelitm=sap.ui.core.Fragment.byId("valuehelp","_IDGenTable1");
                var selValue=oSelitm.getSelectedItem().getAggregation("cells")[0].getProperty("text");
                this.getView().byId("_IDGenInput1").setValue(selValue);
                this.oValHelpFrag.then(function(oFrag){oFrag.close()});
            },

            onConfirm: function(oEvent){              
                var oSelitm=sap.ui.core.Fragment.byId("valuehelp","_IDGenTable1");
                var selValue=oSelitm._aSelectedItems[0].getAggregation("cells")[0].getProperty("text");
                this.getView().byId("_IDGenInput1").setValue(selValue);
                this.oValHelpFrag.then(function(oFrag){oFrag.close()});  
            },

            onAdd: function(oEvent){     
                var oTab = sap.ui.core.Fragment.byId("fragID","CreateStdMultiTab");  
                var oItem=oTab.getAggregation("items");
                var arData=[];
                var data = { "StdId": "",
                        "Firstname": "",
                        "Lastname": "",
                        "Age": "",
                        "Gender": [{"Gen":"M"},
                            {"Gen":"F"}],
                        "course": ""
                     };  
                var oModel = new sap.ui.model.json.JSONModel();
                if(oItem.length==0){
                arData.push(data)
                oModel.setData(arData);   
                // this.getView().setModel(oModel,"CreateRow");       
                }
                else{
                    var pData=this.getView().getModel("CreateRow").getData();
                    pData.push(data);
                    oModel.setData(pData);
                    // this.getView().setModel(oModel,"CreateRow");  
                }
                this.getView().setModel(oModel,"CreateRow"); 

                // this.getView().getModel("studModel").createEntry("/xSHLxP_CDS_STD",{
                //        var a ={ "StdId": "",
                //         "Firstname": "",
                //         "Lastname": "",
                //         "Age": "",
                //         "Gender": "",
                //         "course": ""
         //   }
                // });
                // this.getView().getModel("studModel").submitChange();

            },

            onMultiCreate: function (oEvent) {
                var oStdData = [];
                var oTable = sap.ui.core.Fragment.byId("fragID", "CreateStdMultiTab");
                var oData = this.getView().getModel("CreateRow").getData();
                oStdData.push(oData);
                var oModel = this.getOwnerComponent().getModel('studModel');
                oModel.setDeferredGroups(["batchFunctionImport"])
                var len = oStdData.length
                var std_length = oStdData[len - 1].length;
                for (i = 0; i < std_length; i++) {
                    oModel.callFunction("/create_multi_student", {
                        method: "POST",
                        batchGroupId: "batchFunctionImport",
                        changeSetId: i,
                        urlParameters: {
                            "std_id": oStdData[len - 1][i].StdId,
                            "Firstname": oStdData[len - 1][i].Firstname,
                            "Lastname": oStdData[len - 1][i].Lastname,
                            "Age": oStdData[len - 1][i].Age,
                            "Gender": oStdData[len - 1][i].Gender,
                            "course": oStdData[len - 1][i].course

                        }

                    })
                }

                oModel.submitChanges({
                    batchGroupId: "batchFunctionImport",
                    success: function (odata, response) {

                    },
                    error: function (oerror) {

                    }
                })
            }

        });
    });
