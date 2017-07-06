(function(global, $){
    'use strict'
    var add, date, income, outcome, number, text, add_button, money_storage, select, money_items, remove_button, cancel_button, selected_value, find_date, search_button, result_data, total_btn, result_sum;
    var document         = global.document;
    var forEach          = Array.prototype.forEach;
    var money_api_address = '';

    function init() {
        money_api_address = '/money';
        add = document.querySelector('#add');
        date = add.querySelector('#date');
        select = add.querySelector('#select');
        income = add.querySelector('#income');
        outcome = add.querySelector('#outcome');
        number = add.querySelector('#number');
        text = add.querySelector('#text');
        add_button = add.querySelector('.add-btn');
        cancel_button = add.querySelector('.cancel-btn');
        remove_button = document.querySelector('.remove-button');
        money_items = document.querySelector('.money-items');
        search_button = document.querySelector('.is-search');
        total_btn = document.querySelector('.total-btn');
        find_date =document.querySelector("#find-date");
        result_data = document.querySelector('.result-data');
        result_sum = document.querySelector('.result-sum')
        
        console.log(result_sum);

        load();
        bind();
        bindSearch();
    }
    function load() {
        $.get(money_api_address, function (data, status) {
            money_storage = data;
            render(money_storage);
        });
    }
    function render(data) {
        var template = '';
        money_items.innerHTML = '';
        data.forEach(function(money) {
            template += '<div class="money-group">'+
            '<ul class="money-list">'+
                '<li class="money-item">'+money.date+'</li>'+
                '<li class="money-item">'+money.select+'</li>'+
                '<li class="money-item">'+money.number+'</li>'+
                '<li class="money-item">'+money.text+'</li>'+
            '</ul>'+
            '<button data-remove-index="'+money.id+'" class="remove-button is-primary fa fa-trash-o fa-lg" type="button"></button>'+
            '</div>';
        });
        money_items.innerHTML = template;
        console.log('data:', data);
        result_data.innerHTML = '날짜';
        sum(data);
        
    }
    function bind() {
        add_button.addEventListener('click', addList);
        money_items.addEventListener('click', removeList, false);
        cancel_button.addEventListener('click', cancelList);
        total_btn.addEventListener('click', load);
    }
    function validate(date, money, content){
        if(date.value === ''){
            global.alert('날짜를 선택해주세요.');
            return true;
        }
        if(money.value.trim() === '' || typeof(money) === 'string'){
            global.alert('금액은 숫자를 입력해야 합니다.');
            number.focus();
            return true;
        }
         if(content.value.trim() === ''){
            global.alert('사용내역을 입력해주세요.');
            text.focus();
            return true;
        }
        return false;
    }
    function addList(){
    if(validate(date, number,text)){
        return;
    }
    selected_value = select.selectedIndex;
    if(selected_value === 0){
        selected_value = income.value;
        console.log('income');
    }else{
        selected_value = outcome.value;
        console.log('outcome');
    }
    var money_item = {
        //날짜값
        date: date.value,
        //수입.지출
        select : selected_value,
        //금액
        number : number.value,
        //설명
        text: text.value
        
    };
        $.post(money_api_address, $.param(money_item), function(data, status){
      // console.log('POST 통신 상태:', status);
      // console.log('POST 데이터:', data);
      load();
    }); 
    cancelList();
}
    function cancelList() {
        date.value = '';
        selected_value = '';
        number.value = '';
        text.value = '';
    }
    function removeList(event) {
        var target = event.target;
        // console.log(target);
        if(target.localName === 'button' && target.classList.contains('remove-button')){
           var remove_id = target.dataset.removeIndex;
           console.log(remove_id);
           $.ajax({
               url: money_api_address + '/' + remove_id,
               method: 'DELETE',
               dataType: 'json',
               success: function(data) {
                   load();
               }
           });
           event.stopPropagation();
        }
    }

    function bindSearch(){
        //날짜값을 입력 한 뒤 조회 버튼을 누르면 
        
        search_button.onclick = replaceItem.bind(search_button);
    }
    function replaceItem() {
        
        var result = find_date.value;

        if(find_date.value === ''){
            global.alert('날짜를 선택해주세요.');
            return true;
        }
        console.log(result);
        $.get(money_api_address, function (data, status) {
                var matched_date;
                var matched_object = [];
                money_storage.forEach(function(money,index) {
                
                 if(result === money.date){
                    matched_object.push(money);
                    matched_date = money.date;
                }
            });
            // console.log(matched_date);
            render(matched_object);
            find_date.value = '';
            result_data.innerHTML = '';
            result_data.innerHTML = matched_date || '날짜';
        });
    }
    function sum(data){
        console.log(result_sum);
        var total = 0;
        data.forEach(function(money){
            // console.log(typeof(+money.number));
            if(money.select === '수입'){
                total += (+money.number);
                }
            if(money.select === '지출'){
                    total -= (+money.number);
                }
        })
        // console.log(total);
        result_sum.innerHTML = '';
        result_sum.innerHTML = total + '원';
    }
    init();
})(window, window.jQuery);