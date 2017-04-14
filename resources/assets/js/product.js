class Product{
    /**
     * Is an Integer
     * @param value
     * @returns {boolean}
     */
    isInt(value){
        var er = /^-?[0-9]+$/;
        return er.test(value);
    }

    /**
     * Is a Numeric Value
     * @param value
     * @returns {boolean}
     */
    isNumeric(value){
        return !isNaN(value);
    }

    /**
     * Is a Positive Number
     * @param value
     * @returns {boolean}
     */
    isAPositiveNumber(value){
        return (value > 0);
    }

    /**
     * Get CSRF Token
     * @returns {*}
     */
    getToken(){
        return $.trim($("#token").val());
    }

    /**
     * Get Product ID
     * @returns {*}
     */
    getProductID(){
        return $.trim($("#p_id").val());
    }

    /**
     * Get Product Name
     * @returns {*}
     */
    getName(){
        return $.trim($("#p_name").val());
    }

    /**
     * Get Old Product Name (For Edit Product)
     * @returns {*|jQuery}
     */
    getOldName(){
        return $("#p_name").attr('data-old-name');
    }

    /**
     * Get Product Unit Price
     * @returns {*}
     */
    getUnitPrice(){
        return $.trim($("#unit_price").val());
    }

    /**
     * Get Product Retail Price
     * @returns {*}
     */
    getRetailPrice(){
        return $.trim($("#retail_price").val());
    }

    /**
     * Get Product Quantity
     * @returns {*}
     */
    getQuantity(){
        return $.trim($("#p_quantity").val());
    }

    /**
     * Get Warehouse ID
     * @returns {*}
     */
    getWareHouseId(){
        return $.trim($("#w_id").val());
    }

    /**
     * Validate Form Submit on New Product
     * @param e
     * @returns {boolean}
     */
    validateForm(e){
        console.log("Validate Form");
        e.preventDefault();
        var _this = e.data.context,
            action = (e.data.action === 'add') ? 'add' : 'edit',
            name = _this.getName(),
            unit_price = _this.getUnitPrice(),
            retail_price = _this.getRetailPrice(),
            p_quantity = _this.getQuantity(),
            inventory_id = _this.getWareHouseId();

        _this.removeEventHandlers();

        if (_this.isNumeric(unit_price) &&
            _this.isNumeric(retail_price) &&
            _this.isInt(p_quantity) &&
            _this.isAPositiveNumber(unit_price) &&
            _this.isAPositiveNumber(p_quantity) &&
            _this.isAPositiveNumber(retail_price)
        ) {
            if (!_this.detectEditChange()) {
                _this.verifyProductExist(inventory_id, name, action, _this);
                _this.errors.hideErrorDOM();
            } else {
                if (action === 'edit') {
                    _this.updateProduct(
                        _this.getWareHouseId(),
                        _this.getProductID(),
                        _this.getName(),
                        _this.getUnitPrice(),
                        _this.getRetailPrice(),
                        _this.getQuantity(),
                        _this.getToken()
                    );
                }

                if (action === 'add') {
                    context.saveProduct(
                        context.getWareHouseId(),
                        context.getName(),
                        context.getUnitPrice(),
                        context.getRetailPrice(),
                        context.getQuantity(),
                        context.getToken()
                    );
                }
            }
        } else {
            _this.addEventHanlder();
            _this.errors.clearErrors();
            if (!_this.isNumeric(unit_price)) {
                _this.errors.add("Price must be a numerical value.");
            }

            if (!_this.isNumeric(retail_price)) {
                _this.errors.add("Retail must be a numerical value.");
            }

            if (!_this.isInt(p_quantity)) {
                _this.errors.add("Quantity must be a Integer value.");
            }

            if(!_this.isAPositiveNumber(unit_price)){
                _this.errors.add("Invalid Price value.");
            }

            if(!_this.isAPositiveNumber(p_quantity)){
                _this.errors.add("Invalid Quantity value.");
            }

            if(!_this.isAPositiveNumber(retail_price)){
                _this.errors.add("Invalid Retail Price value.");
            }

            _this.errors.appendErrorsToDOM();
            _this.errors.showErrorDOM();
        }
        return false;
    }

    /**
     * Check if product already exist
     * @param inventory_id
     * @param name
     * @param action
     * @param context
     */
    verifyProductExist(inventory_id, name, action, context){
        $.ajax({
            url: '/inventory/product/exist',
            type: 'GET',
            data: {
                name: name,
                inventory_id: inventory_id
            },
            success: function (res) {
                if (res) {
                    context.errors.clearErrors();
                    context.errors.add("Item Already Exist.");
                    context.errors.appendErrorsToDOM();
                    context.errors.showErrorDOM();
                    context.addEventHanlder();
                } else {
                    if (action === 'edit') {
                        context.updateProduct(
                            context.getWareHouseId(),
                            context.getProductID(),
                            context.getName(),
                            context.getUnitPrice(),
                            context.getRetailPrice(),
                            context.getQuantity(),
                            context.getToken()
                        );
                    }

                    if (action === 'add') {
                        context.saveProduct(
                            context.getWareHouseId(),
                            context.getName(),
                            context.getUnitPrice(),
                            context.getRetailPrice(),
                            context.getQuantity(),
                            context.getToken()
                        );
                    }
                }
            }
        });
    }

    /**
     * Save Product
     * @param inventory_id
     * @param name
     * @param unit_price
     * @param quantity
     * @param token
     */
    saveProduct(inventory_id, name, unit_price, retail_price, quantity, token){
        $.ajax({
            url: '/inventory/product/add',
            type: 'POST',
            data: {
                _token: token,
                id: inventory_id,
                p_name: name,
                unit_price: unit_price,
                retail_price : retail_price,
                p_quantity: quantity
            },
            success: function (res) {
                if (res) {
                    window.location = '/inventory/' + inventory_id + '/products';
                }
            }
        });
    }

    /**
     * Update Product
     * @param inventory_id
     * @param p_id
     * @param name
     * @param unit_price
     * @param quantity
     * @param token
     */
    updateProduct(inventory_id, p_id, name, unit_price, retail_price, quantity, token){
        $.ajax({
            url: '/inventory/product/update',
            type: 'POST',
            data: {
                _token: token,
                id: inventory_id,
                p_id: p_id,
                p_name: name,
                unit_price: unit_price,
                retail_price : retail_price,
                p_quantity: quantity
            },
            success: function (res) {
                if (res) {
                    window.location = '/inventory/' + inventory_id + '/products';
                }
            }
        });
    }

    /**
     * Check if Product Fields are changed on (EDIT)
     * @returns {boolean}
     */
    detectEditChange(){
        var name = this.getName(),
            old_name = this.getOldName();

        return (name === old_name);
    }

    /**
     * Redirect back to warehouse Products page
     * if no change detected on (EDIT)
     * @param wd_id
     */
    redirectAsUnChanged(wd_id){
        window.location = '/inventory/' + wd_id + '/products';
    }

    /**
     * Remove Add Product Form Submission Event handlers
     */
    removeEventHandlers(){
        $("#add-product-form").unbind("submit");
    }

    /**
     * Attach Add Prdocut Form Submission Event handlers
     */
    addEventHanlder(){
        $("#add-product-form").on("submit", {context: this, action: 'add'}, this.validateForm);
    }

    /**
     * Show Product Transactions Details
     * @param e
     */
    showProductDetails(e){
        e.preventDefault();
        var _this = e.data.context,
            prod_id = $.trim($(this).attr('data-product-id')),
            inventory_id = $.trim($(this).attr('data-inventory-id'));
        console.log(inventory_id);

        $.ajax({
            type : 'GET',
            url : '/inventory/'+inventory_id+'/profit/byId',
            data : {
                id : prod_id
            },
            success : function(transactions){
                if(transactions.length){
                    _this.setTransactionProductName(prod_id);
                    _this.appendTableHeader();
                    _this.appendItemsToDOM(transactions);
                    _this.showTransactionsModal();
                }else{
                    bootbox.alert("No transactions available for this product!");

                }
            }
        });
    }

    /**
     * Show Product Transaction Details Modal
     */
    showTransactionsModal(){
        $("#product-dt-modal").modal('show');
    }

    /**
     * Clear Product Transaction Details Modal Table
     */
    clearTransactionModalBody(){
        $("#product-dt-modal .modal-body .table").empty();
    }

    /**
     * Set Product Transaction Details Modall Title
     * @param name
     */
    setTransactionProductName(name){
        $("#product-dt-title").text(name + ' Details');
    }

    /**
     * Append Product Transaction Details Modal Table Header
     */
    appendTableHeader(){
        var head_titles = ['# ID', 'Quantity', 'Total Cost', 'Total Retail', 'Profit', 'Date', 'Time'];
        var $head = `<thead><tr><th>${head_titles.join('</th><th>')}</th></tr></thead>`;
        $("#product-dt-modal .modal-body .table").append($head);
    }

    /**
     * Append Products to Transaction Details Modal Table
     * @param transactions
     */
    appendItemsToDOM(transactions){
        transactions.forEach(function (transaction) {
            var $transaction = [
                transaction.id,
                transaction.item_quantity,
                transaction.cost_total,
                transaction.retail_total,
                transaction.retail_total - transaction.cost_total,
                moment(transaction.created_at).format('YYYY-MM-DD'),
                moment(transaction.created_at).format('HH:mm:ss a')
            ];
            var $item = `<tbody><tr><td>${$transaction.join('</td><td>')}</td></tr></tbody>`;
            $("#product-dt-modal .modal-body .table").append($item);
        });
    }

    /**
     * Search Product on List
     * @param e
     */
    productSearch(e){
        e.preventDefault();
        var query = $.trim($(this).val()).toLowerCase();

        var $products = $(".product-search-name");
        if(query.length){
            console.log($products.length);
            for(var i = 0; i < $products.length; i++){
                var value = $.trim($($products[i]).attr('data-name')).toLowerCase();
                if(value.search(query) != -1){
                    $($products[i]).parent('tr').slideDown();
                }else{
                    $($products[i]).parent('tr').slideUp();
                }
            }
        }else{
            $($products).parents('tr').slideDown();
        }
    }

    constructor(){
        this.errors = new Errors('#p_error');

        // Add/Edit Product
        $("#add-product-form").on("submit", {context: this, action: 'add'}, this.validateForm);
        $("#edit-product-form").on("submit", {context: this, action: 'edit'}, this.validateForm);

        // Product Transaction Details
        $(".product-details").on('click', {context : this}, this.showProductDetails);
        $('#product-dt-modal').on('hidden.bs.modal', {context :this }, this.clearTransactionModalBody);

        // Product Search
        $("#product-search").on('keyup', {context : this}, this.productSearch);

        $(".delete-product").on('click', {context : this} , this.confirmProductDelete);
    }

    confirmProductDelete(e) {
        e.preventDefault();
        var _this = this;
        bootbox.confirm("Are you sure you want to delete this product!", function(result){
            if(result){
                window.location = $(_this).attr('href');
            }
        });

    }
}

var product = new Product();