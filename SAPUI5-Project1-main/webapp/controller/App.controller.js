sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/Fragment",
   'sap/m/MessageToast'
],  function (Controller, Fragment, JSONModel, MessageToast) {
    "use strict";
    return Controller.extend("SAPUI5 WorkListApp.controller.App", {
      // onInit é quando inicia a pagina
      onInit : function () {
         // Dados iguais aos do .json por isso não é necessario ter nada no manifest
         // no futuro iremos substituir isto por uma conexao a base de dados
         var students = [{
            "Name": "João Claudio",
            "Year": "11",
            "Class": "2ºPSI",
            "Number": 10,
            "School": "Raul Proença",
            "Address": "Rua 2 Nº1"
         },

         {
            "Name": "Tomás Félix",
            "Year": "11",
            "Class": "2ºPSI",
            "Number": 23,
            "School": "Raul Proença",
            "Address": "Rua 1 Nº2"
         }];

         // Criamos o modelo de dados
         var oModel = new sap.ui.model.json.JSONModel();

         // e igualamos aos dados
         oModel.setData({
            students
         });

         this.getView().setModel(oModel);
		},

      // Botão para adicionar o aluno Teste            
      addStudent : function ()
      {
         // Vamos buscar o modelo de dados
         var oModel = this.getView().getModel();

         // Equalamos o oData ao modelo
         var oData = oModel.getData();                                                                                                                 
         
         // Equalamos os students ao oData
         var students = oData.students;
         
         // Adicionamos um novo student no final do array (push)
         students.push({
            "Name": "teste",
            "Year": "teste",
            "Class": "teste",
            "Number": 0,
            "School": "D.João II",
            "Address": "Teste"
         
         })

         // igualamos os students aos dados
         oModel.setData({
            students : students,
            newstudent : {}
         });

         MessageToast.show("Student added with sucess!");

         this.getView().setModel(oModel);
      },

      // Botão para adicionar e preencher um aluno
      openDialog : function ()
      {
         if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "SAPUI5 WorkListApp.view.StudentDialog"
				});
			} 

         var oModel = this.getView().getModel();
         var oData = oModel.getData();         
         var students = oData.students;

         var newstudent = {
            "Name": "",
            "Year": "",
            "Class": "",
            "Number": "",
            "School": "",
            "Address": ""
         };

         oModel.setData({
            students : students,
            newstudent : newstudent
         });

         this.getView().setModel(oModel);

			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
      },

      // Botão para confirmar o novo aluno
      confirmStudent : function ()
      {
         var oModel = this.getView().getModel();
         var oData = oModel.getData();         
         var students = oData.students;
         var newstudent = oData.newstudent;

         var a = 0;
         var err = {};

         // Verificar campos em branco
         if (newstudent.Name == "")
         {
            err[a] = "name";
            a++;
         }
         if (newstudent.Year == "")
         {
            err[a] = "year";
            a++;
         }
         if (newstudent.Class == "")
         {
            err[a] = "class";
            a++;
         }
         if (newstudent.Number == "")
         {
            err[a] = "number";
            a++;
         }
         if (isNaN(newstudent.Number) == true)
         {
            err[a] = "invalid number";
            a++;
         }
         if (newstudent.Address == "")
         {
            err[a] = "address";
            a++;
         }

         // Verificar se não existe 2 alunos com o mesmo numero na mesma turma
         for (var i = 0; i < students.length; i++) 
         {
            if (newstudent.Number == students[i].Number && newstudent.Class == students[i].Class)
            {
               MessageToast.show("Já existe um aluno nº " + newstudent.Number + " na turma " + newstudent.Class + ".");
               return;
            }
         }

         // Criar mensagem com todos os erros
         if (a > 0)
         {
            if(isNaN(newstudent.Number) == true) {
               var msg = "Error: "
            }
            else{
               var msg = "Falta preencher os campos: "
            }

            for (var i = 0; i < a; i++) 
            {
               // Se exister mais de 1 erro adiciona uma virgula
               if ((i + 1) < a)
               {
                  msg = (msg + err[i] + ", ");
               }
               else
               {
                  msg = (msg + err[i] + " ");
               }
            } 

            MessageToast.show(msg);
            return;
         }

         // Colocar o newstudent dentro do student
         students.push(newstudent);

         oModel.setData({
            students : students,
            newstudent : newstudent
         });

         this.getView().setModel(oModel);

         MessageToast.show("Student added with sucess!");

         this.pDialog.then(function(oDialog) {
            oDialog.close();
         });
      },

      // Botão para fechar o dialog
      closeDialog : function ()
      {
         this.pDialog.then(function(oDialog) {
            oDialog.close();
         });
      },

      // Botão para dar delete
      deleteStudent : function (oEvent)
      {
         // Buscar o id da row que clicamos
         var oContext = oEvent.getSource().getBindingContext();
         var id = oContext.getPath();

         var oModel = this.getView().getModel();
         var oData = oModel.getData();
         var students = oData.students;

         // Cortar o id para ficar so com o index
         var cutId = id.slice(-1);

         // Remover o index da array
         students.splice(cutId, 1); 

         oModel.setData({
            students : students,
            newstudent : {}
         });

         MessageToast.show("Student deleted with sucess!");

         this.getView().setModel(oModel);
      },

      // Botão para editar
      editStudent : function (oEvent)
      {
         if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "SAPUI5 WorkListApp.view.EditDialog"
				});
			} 

         var oContext = oEvent.getSource().getBindingContext();
         var id = oContext.getPath();

         var oModel = this.getView().getModel();
         var oData = oModel.getData();
         var students = oData.students;

         var cutId = id.slice(-1);

         // Abrir dialog com os dados do aluno selecionado
         var newstudent = students[cutId];

         oModel.setData({
            students : students,
            newstudent : newstudent
         });

         this.getView().setModel(oModel);

			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
      },

      // Botão para fechar dialog de editar
      closeEditDialog : function ()
      {
         this.pDialog.then(function(oDialog) {
            oDialog.close();
         });
      },

      // Botão para confirmar as alteraçoes do aluno
      confirmEditStudent : function (oEvent)
      {
         var oContext = oEvent.getSource().getBindingContext();
         var id = oContext.getPath();
         
         var oModel = this.getView().getModel();
         var oData = oModel.getData();
         var students = oData.students;
         var newstudent = oData.newstudent;

         var cutId = id.slice(-1);

         var a = 0;
         var err = {};

         // Verificar campos em branco
         if (newstudent.Name == "")
         {
            err[a] = "name";
            a++;
         }
         if (newstudent.Year == "")
         {
            err[a] = "year";
            a++;
         }
         if (newstudent.Class == "")
         {
            err[a] = "class";
            a++;
         }

         if (newstudent.Number == "")
         {
            err[a] = "number";
            a++;
         }
         if (isNaN(newstudent.Number) == true)
         {
            err[a] = "invalid number";
            a++;
         }

         if (newstudent.Address == "")
         {
            err[a] = "address";
            a++;
         }

         // Verificar se não existe 2 alunos com o mesmo numero na mesma turma
         for (var i = 0; i < students.length; i++) 
         {
            if (newstudent.Number == students[i].Number && newstudent.Class == students[i].Class && i != cutId && isNaN(newstudent.Number) == false)
            {
               MessageToast.show("Já existe um aluno nº " + newstudent.Number + " na turma " + newstudent.Class + ".");
               return;
            }
         }

         // Criar mensagem com todos os erros
         if (a > 0)
         {
            if(isNaN(newstudent.Number) == true) {
               var msg = "Error: "
            }
            else{
               var msg = "Falta preencher os campos: "
            }

            for (var i = 0; i < a; i++) 
            {
               // Se exister mais de 1 erro adiciona uma virgula
               if ((i + 1) < a)
               {
                  msg = (msg + err[i] + ", ");
               }
               else
               {
                  msg = (msg + err[i] + " ");
               }
            } 

            MessageToast.show(msg);
            return;
         }

         // Aplicar alterações
         students[cutId] = newstudent;

         oModel.setData({
            students : students,
            newstudent : {}
         });

         this.getView().setModel(oModel);

         MessageToast.show("Student edited with sucess!");

         this.pDialog.then(function(oDialog) {
            oDialog.close();
         });
      },
      studentDetail : function (oEvent)
      {
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetDetailParameter", { parameter: student[cutId].Address} );
      }
   });
});