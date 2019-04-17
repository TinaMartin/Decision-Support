sap.ui.controller("content.SalesOrders", {
	
	// controller logic goes here
	
	onInit: function() {
		// this function is called when the view is instantiated. 
		// Used to modify the view before displaying
		
		// first, we have to define the odata model 
        var dataModel = new sap.ui.model.odata.ODataModel(
        	"models/GBI.xsodata"
        );   
        // after that, we can bind the odata model the 
        // SalesOrders view, so controls within the view can use them
        this.getView().setModel(dataModel);

	},
	
	onExit: function() {
		// this function is called when the view is destroyed. 
		// Used for clean-up activities
	},
	
	onAfterRendering: function() {
		// this function is called when the view has been rendered. 
		// Used for post-rendering manipulation of the HTML code
	},
	
	onBeforeRendering: function() {
		// this function is called before the view is re-rendered
		// (not before first rendering)
	},
	
	// this function updates the details panel
    updateDetails: function(oEvent) {
    	// first, we need to get the context of the selected
    	// row from the event
    	var rowContext = oEvent.getParameter("rowContext");				
    	// next, we need the TextView control that we want
    	// to manipulate
    	var Id = this.getView().byId("Id");
    	// now we can set the TextView to the value of a
    	// field of the selected row
    	Id.setValue(rowContext.getObject().Id); 
    	
    	var store = this.getView().byId("Store");
        store.setValue(rowContext.getObject().Store); 		
        
        // var customerCountryInput = this.getView().byId("country");
        // customerCountryInput.setValue(rowContext.getObject().COUNTRY_LABEL); 	
        
        // var customerSalesOrgInput = this.getView().byId("salesOrg");
        // customerSalesOrgInput.setValue(
        // 	rowContext.getObject().SALES_ORGANISATION_LABEL
        // );
    },
    
    // this function updates the bar chart
	handleChange: function(oEvent) {
	    
	    // first, we have to get the new values of the two dates 
        // from our date range selector
        var fromDate = oEvent.getSource().getDateValue();
        var toDate = oEvent.getSource().getSecondDateValue();
        
        // if there is no fromDate is set, we'll set 
        // it to the 01/01/1970
        if (!fromDate) {
            fromDate = new Date(1970,1,1);
        }
        // if there is no toDate set, we'll set
        // it to the current date
        if (!toDate) {
            toDate = new Date();
        }
        
        // next, we want to update the filters on our flattened data set
	    // to manipulate it. first , we have to get it
        var fd = this.getView().byId("chainTableId");
        
        // now, we build a new filter based on the values retrieved 
        // from our event. because the retrieved values are dates, 
        // we have to extract the months and years.
        // the first argument defines the column on which we want 
        // to filter, the second argument the filter operation
        // (BT stands for "in between") and the last two 
        // arguments the actual filter values
        var monthFilter = new sap.ui.model.Filter(
            "MONTH", 
            sap.ui.model.FilterOperator.BT, 
            fromDate.getMonth(), 
            toDate.getMonth()
        );
        
        var yearFilter = new sap.ui.model.Filter(
            "YEAR", 
            sap.ui.model.FilterOperator.BT, 
            fromDate.getFullYear(), 
            toDate.getFullYear()
        );
    
        // in addition, we want to sort our data by net revenue
        // the second (boolean) value defines if the data is sorted
        // in descending order
        var sorter = new sap.ui.model.Sorter(
            "NET_REVENUE", 
            true
        );
        
        // then, we need to re-bind the data to the flattened 
        // dataset with the new filters and the sorter
        fd.bindData(
            "/ForecastView",
            null, 
            [sorter], 
            [
                monthFilter, 
                yearFilter
            ]
        );
	}
});
