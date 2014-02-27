var doNW = function(string1, string2){

	// do needleman wunsch
	var final_array = []
	var bread_crumbs = []
	var alignment1 = ''
	var alignment2 = ''

	var match_reward = parseInt(document.getElementById('match_reward').value)
	var gap_penalty = parseInt(document.getElementById('gap_penalty').value)
	var mismatch_penalty = parseInt(document.getElementById('mismatch_penalty').value)
	

	for(var i = 0; i < string2.length+1; i++){
		for(var j = 0; j < string1.length+1; j++){
			if(j == 0){
				final_array[i] = []
				bread_crumbs[i] = []
			}
			
			if(i == 0 && j == 0){
				final_array[i][j] = 0
				bread_crumbs[i][j] = ''
			}
			else if(i == 0){
				final_array[i][j] = final_array[i][j-1] - 1
				bread_crumbs[i][j] = 'l'	
			}
			else if(j == 0){
				final_array[i][j] = final_array[i-1][j] - 1
				bread_crumbs[i][j] = 'u'
			}
			else{
			
				i_str_index = i-1
				j_str_index = j-1
				
				up = final_array[i-1][j] + gap_penalty
				left = final_array[i][j-1] + gap_penalty
				diag = final_array[i-1][j-1] + mismatch_penalty
				
				match = (string2[i_str_index] === string1[j_str_index])?true:false
				if(match){
					diag = final_array[i-1][j-1] + match_reward
				}
				
				var max = Math.max(up, left, diag)
				
				final_array[i][j] = max

				if(diag === max){
					bread_crumbs[i][j] = 'd'
				}
				else if(up === max){
					bread_crumbs[i][j] = 'u'
				}
				else if(left === max){
					bread_crumbs[i][j] = 'l'
				}

			}
		}
	}

	// dump the results
	var dump_to = document.getElementById('results')
	var html = '<h3>Alignment Table</h3><table class="table table-bordered res_table"><thead></thead><tbody id="results_table_body">'
	for(var i = 0; i < string2.length+2; i++){
		html += '<tr>'
		for(var j = 0; j < string1.length+2;j++){
			if((i == 0 && j == 0) || (i == 0 && j == 1) || (i == 1 && j == 0)){
				html += '<td></td>'
			}
			else if(i == 0){
				html += '<td class="str">'+string1[j-2]+'</td>'
			}
			else if(j == 0){
				html += '<td class="str">'+string2[i-2]+'</td>'
			}
			else{
				var id = ''+(i-1)+''+(j-1)
				html += '<td id='+id+'>'+final_array[i-1][j-1]+'</td>'
			}
		}
		html += '</tr>'
	}
	html += '</tbody></table>'
	html += '<div class="text-right"><strong>Alignment Score: '+final_array[final_array.length-1][final_array[0].length-1]+'</strong></div>'
	dump_to.innerHTML = html

	// show the bread crumbs and get the alignment strings
	var not_done = true
	var i = (bread_crumbs.length-1)
	var j = (bread_crumbs[0].length-1)
	while(not_done){
		var element = document.getElementById(i+''+j)
		element.className = 'selected-bg'

		if(bread_crumbs[i][j] === ''){
			break;
		}
		else if(bread_crumbs[i][j] === 'u'){
			i -= 1
			alignment1 = ' '+alignment1
			alignment2 = string2.substring(string2.length-1, string2.length) + alignment2 
			string2 = string2.substring(0,string2.length-1)
		}
		else if(bread_crumbs[i][j] === 'l'){
			j -= 1
			alignment2 = ' '+alignment2
			alignment1 = string1.substring(string1.length-1, string1.length) + alignment1 
			string1 = string1.substring(0,string1.length-1)
		}
		else if(bread_crumbs[i][j] === 'd'){
			i -= 1
			j -= 1

			alignment1 = string1.substring(string1.length-1, string1.length) + alignment1 
			string1 = string1.substring(0,string1.length-1)

			alignment2 = string2.substring(string2.length-1, string2.length) + alignment2 
			string2 = string2.substring(0,string2.length-1)
		}
	}

	var algn1 = alignment1.split('')
	var algn2 = alignment2.split('')
	var align_html = ''
	align_html += '<h3>Alignment String</h3>'
	align_html += '<table class="table table-bordered res_table"><thead></thead><tbody>'
	align_html += '<tr>'
	for(var i = 0; i < algn1.length; i++){
		align_html += '<td>'+algn1[i]+'</td>'
	}
	align_html += '</tr>'
	align_html += '<tr>'
	for(var j = 0; j < algn2.length; j++){
		align_html += '<td>'+algn2[j]+'</td>'
	}
	align_html += '</tr>'
	dump_to.innerHTML += align_html

}

document.getElementById('gogogo').onclick = function(){
	document.getElementById('example').checked = false
	doNW(
		document.getElementById('string1').value,
		document.getElementById('string2').value
	)
}

document.getElementById('example').onclick = function(){

	var v1 = 'gcggtt'
	var v2 = 'gcgt'
	
	document.getElementById('string1').value = v1
	document.getElementById('string2').value = v2

	doNW(v1, v2)
}