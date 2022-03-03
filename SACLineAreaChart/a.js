
var  m = Table_1.getDataSource().getResultSet();
console.log(m);
	

var level9 = [m[0]];
var level10 = [m[0]];
var level11 = [m[0]];
var level12 = [m[0]];
var level13 = [m[0]];
var level14 = [m[0]];
var level15 = [m[0]];
var level16 = [m[0]];

level10.pop();
level11.pop();
level12.pop();
level13.pop();
level14.pop();
level15.pop();
level16.pop();

for(var i = 1; i < m.length; i++){
switch (m[i].LEVEL.id) {
  case '1':
    level9.push(m[i]);
    break;
  case '2':
    level10.push(m[i]);
    break;
  case '3':
    level11.push(m[i]);
    break;
  case '4':
    level12.push(m[i]);
    break;
  case '5':
    level13.push(m[i]);
    break;
  case '6':
    level14.push(m[i]);
    break;
  case '7':
    level15.push(m[i]);
    break;
  case '8':
    level16.push(m[i]);
    break;
}
}

console.log(level9);

var data_$_1 =[level9];
data_$_1.push(level10);
data_$_1.push(level11);
data_$_1.push(level12);
data_$_1.push(level13);
data_$_1.push(level14);
data_$_1.push(level15);
data_$_1.push(level16);

console.log(data_$_1);
Dropdown_1.setFooter(data_$_1);

var filternode_1 = [level9[0].NODENAME.id];
filternode_1.pop();

var filtervalue_1 = [''];
filtervalue_1.pop();

var count_1 = 0;
for(var n = 0; n < level9.length; n++){
            
            var id6 = level9[n].NODEID.id;
            var node7 = '';
            var pc7 = 0;
            
            for (var o = 0; o < level10.length; o++){
                        
                        if (level10[o].PARENTID.id === id6){
                                    
                                    pc7 = pc7 + 1;                           
                                    var node8 = '';
                                    var id7 = level10[o].NODEID.id;
                                    var pc8 = 0;
                                    
                                    for (var p = 0; p < level11.length; p++){
                                                
                                                if (level11[p].PARENTID.id === id7){
                                                            
                                                            pc8 = pc8 + 1;
                                                            var node9 = '';
                                                            var id8 = level11[p].NODEID.id;
                                                            var pc9 = 0;
                                                            
                                                            for (var q = 0; q < level12.length; q++){
                                                                        
                                                                        if (level12[q].PARENTID.id === id8){
                                                                                    
                                                                                    pc9 = pc9 + 1;
                                                                                    var node10 = '';
                                                                                    var id9 = level12[q].NODEID.id;
                                                                                    var pc10 = 0;
                                                                                    
                                                                                    for (var r = 0; r < level13.length; r++){
                                                                                                
                                                                                                if (level13[r].PARENTID.id === id9){
                                                                                                            
                                                                                                            pc10 = pc10 + 1;
                                                                                                            var node11 = '';
                                                                                                            var id10 = level13[r].NODEID.id;
                                                                                                            var pc11 = 0;
                                                                                                            
                                                                                                            for (var s = 0; s < level14.length; s++){
                                                                                                                        
                                                                                                                        if (level14[s].PARENTID.id === id10){
                                                                                                                                    
                                                                                                                                    pc11 = pc11 + 1;
                                                                                                                                    var node12 = '';
                                                                                                                                    var id11 = level14[s].NODEID.id;
                                                                                                                                    var pc12 = 0;
                                                                                                                                    
                                                                                                                                    for (var t = 0; t < level15.length; t++){
                                                                                                                                                
                                                                                                                                                if (level15[t].PARENTID.id === id11){
                                                                                                                                                            
                                                                                                                                                            pc12 = pc12 + 1;
                                                                                                                                                            node7 = node7 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            node8 = node8 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            node9 = node9 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            node10 = node10 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            node11 = node11 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            node12 = node12 + ',' +level15[t].NODENAME.id;
                                                                                                                                                            var node13 = level15[t].Description_w2g5s05h2c.id;
                                                                                                                                                            
                                                                                                                                                            filternode_1[count_1] = level15[t].Description_w2g5s05h2c.id;
                                                                                                                                                            filtervalue_1[count_1] = node13;
                                                                                                                                     count_1++;
                                                                                                                                                }
                                                                                                                                    }
                                                                                                                                    
                                                                                                                                    if(pc12 === 0){
                                                                                                                                                node12 = node12 + ',' +level14[s].NODENAME.id;
                                                                                                                                                node7 = node7 + ',' +level14[s].NODENAME.id;
                                                                                                                                                node8 = node8 + ',' +level14[s].NODENAME.id;
                                                                                                                                                node9 = node9 + ',' +level14[s].NODENAME.id;
                                                                                                                                                node10 = node10 + ',' +level14[s].NODENAME.id;
                                                                                                                                                node11 = node11 + ',' +level14[s].NODENAME.id;
                                                                                                                                    }
                                                                                                                                    filternode_1[count_1] = level14[s].NODENAME.id;
                                                                                                                                    filtervalue_1[count_1] = node12;
                                                                                                             count_1++;                                                                                                                                   
                                                                                                                        }
                                                                                                                        
                                                                                                            }                                                                                               
                                                                                                            
                                                                                                            if(pc11 === 0){
                                                                                                                        node11 = node11 + ',' +level13[r].NODENAME.id;
                                                                                                                        node7 = node7 + ',' +level13[r].NODENAME.id;
                                                                                                                        node8 = node8 + ',' +level13[r].NODENAME.id;
                                                                                                                        node9 = node9 + ',' +level13[r].NODENAME.id;
                                                                                                                        node10 = node10 + ',' +level13[r].NODENAME.id;
                                                                                                            }
                                                                                                            filternode_1[count_1] = level13[r].NODENAME.id;
                                                                                                            filtervalue_1[count_1] = node11;
                                                                                     count_1++;
                                                                                                }
                                                                                                
                                                                                    }                                                                                   
                                                                                    
                                                                                    if(pc10 === 0){
                                                                                                node10 = node10 + ',' +level12[q].NODENAME.id;
                                                                                                node7 = node7 + ',' +level12[q].NODENAME.id;
                                                                                                node8 = node8 + ',' +level12[q].NODENAME.id;
                                                                                                node9 = node9 + ',' +level12[q].NODENAME.id;
                                                                                    }
                                                                                    filternode_1[count_1] = level12[q].NODENAME.id;
                                                                                    filtervalue_1[count_1] = node10;
                                                             count_1++;                                                                                   
                                                                        }                                                                       
                                                                        
                                                            }
                                                                                                            
                                                            if(pc9 === 0){
                                                                        node9 = node9 + ',' +level11[p].NODENAME.id;
                                                                        node7 = node7 + ',' +level11[p].NODENAME.id;
                                                                        node8 = node8 + ',' +level11[p].NODENAME.id;
                                                            }
                                                            filternode_1[count_1] = level11[p].NODENAME.id;
                                                            filtervalue_1[count_1] = node9;
                                     count_1++;
                                                            
                                                }
                                                
                                    }                       
                                    
                                    if(pc8 === 0){
                                                node8 = node8 + ',' +level10[o].NODENAME.id;
                                                node7 = node7 + ',' +level10[o].NODENAME.id;
                                    }
                                    filternode_1[count_1] = level10[o].NODENAME.id;
                                    filtervalue_1[count_1] = node8;
                    count_1++;
                        }           
                        
            }
            
            if(pc7 === 0){
                        node7 = node7 + ',' +level9[n].NODENAME.id;
            }
            filternode_1[count_1] = level9[n].NODENAME.id;
            filtervalue_1[count_1] = node7;
            count_1++;
                        
}

filternode_1 = filternode_1;
filtervalue_1 = filtervalue_1;
		

console.log("Node: " );
console.log(filternode_1);

console.log(filtervalue_1);
