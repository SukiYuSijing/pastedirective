/* eslint-disable no-debugger */ /* eslint-disable no-unused-vars */ /*
eslint-disable no-unused-vars */
<template>
  <div id="app">
    <el-button @click="handleClick"
      >{{ !show ? '展开' : '收起' }}工作和兴趣列</el-button
    >
    <el-table
      v-paste
      border
      ref="table"
      :span-method="spanMethod"
      :data="tableData"
      :header-cell-class-name="getHeaderCellStyle"
      :cell-class-name="getCellClassName"
      style="width: 100%"
    >
      <!--合并单元格-->
      <el-table-column
        label="合并单元格1"
        width="120"
        name="combineCell1"
        prop="combineCell1"
      >
      </el-table-column>
      <el-table-column
        label="合并单元格2"
        width="120"
        name="combineCell2"
        prop="combineCell2"
      >
      </el-table-column>
      <el-table-column
        label="合并单元格3"
        width="120"
        name="combineCell3"
        prop="combineCell3"
      >
      </el-table-column>
      <!---->
      <el-table-column label="日期" width="120" name="date" prop="date">
        <template slot-scope="scope">
          <el-input v-model="scope.row.date"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="job"
        v-if="show"
        label="工作"
        name="job"
        width="120"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.job"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="hobby"
        v-if="show"
        label="兴趣"
        name="hobby"
        width="120"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.hobby"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" name="address">
      </el-table-column>
      <el-table-column prop="name" label="姓名" name="name" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="地址1" width="120" prop="address1">
        <template slot-scope="scope">
          <el-input v-model="scope.row.address1"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="地址2"
        name="address2"
        width="120"
        prop="address2"
      >
        <template slot-scope="scope">
          <el-input disabled v-model="scope.row.address2"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" name="gender" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.gender"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="年纪" name="age" prop="age" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.age"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
var headername = [];
export default {
  data() {
    return {
      headername: [],
      show: true,
      inputList: [],
      tableData: [],
      spanList1: [],
      spanList2: [],
      spanList3: [],
      spanList4: [],
    };
  },
  directives: {
    paste: {
      inserted: function(el, binding, vnode) {
        var headername = [];
        function getParentNode(tagname, node) {
          var parentnode = node.parentNode;
          while (parentnode.tagName.toLowerCase() != tagname) {
            parentnode = parentnode.parentNode;
          }
          return parentnode;
        }
        var self = vnode.componentInstance;
        self.$el.addEventListener('paste', function(event) {
          //粘贴事件监听代理
          event.preventDefault();
          headername.length = 0;
          // let table = self.$children.filter(child=>reg.test(child.$vnode.tag))[0]
          let tableHeader = self.$refs.tableHeader;
          for (let item of tableHeader.columns) {
            headername.push(item.property);
          }
          if (
            event.target.tagName.toLowerCase() !== 'input' ||
            event.target.getAttribute('disabled')
          )
            return;
          //获取当前table中所有的tag为input的元素
          let inputlist = document.querySelectorAll('input');
          //获取当前table中所有的tag为tr的元素-行
          let trlist = document.querySelectorAll('tr.el-table__row');
          //循环找到粘贴执行的单元格的index
          for (let i in inputlist) {
            if (event.target == inputlist[i]) {
              var targetInputIndex = i; //获得执行粘贴动作的表格
              break;
            }
          }
          //通过event.clipboardData获取复制的内容
          let text = event.clipboardData.getData('text');
          text = text.replace(/\n$/, '');
          text = text.split('\n');
          //获得格式化成数组后的复制内容
          var textAfterFormat = text.map((item, index) => {
            return text[index].split('\t');
          });
          //获得粘贴单元格所在的tr的index
          let targetTr = getParentNode('tr', event.target);
          for (let i in trlist) {
            if (targetTr == trlist[i]) {
              var targetRowIndex = i;
              break;
            }
          }
          // eslint-disable-next-line no-unused-vars
          var targetColumn = 0;
          //获得粘贴单元格所在的td
          let targetTd = getParentNode('td', inputlist[targetInputIndex]);
          //根据在methods->getHeaderCellStyle的方法中将table的表头全都放进headername数组，这时候通过遍历该数组获得columnHeaders
          let columnHeaderIndex = headername.indexOf(
            targetTd.className
              .match(/\b_headerName_[\W\w]+\b/)[0]
              .replace('_headerName_', '')
          );
          //获得粘贴所在的列的index->targetColumn
          for (let i in trlist[targetRowIndex].childNodes) {
            if (trlist[targetRowIndex].childNodes[i] == targetTd) {
              targetColumn = i;
              break;
            }
          }
          //截取从粘贴位置开始的表头
          let headernameFromPasteColumn = headername.slice(columnHeaderIndex);
          self.$nextTick(function() {
            for (let i in textAfterFormat) {
              //获得当前复制元素对应的行数，比如如果是从第三行开始粘贴，那么复制内容的第三行对应的是table表格的第五行
              let curRowIndex = Number(targetRowIndex) + Number(i);
              let tr = trlist[curRowIndex];
              if (!tr) continue;
              headernameFromPasteColumn.forEach(function(item, idx) {
                let className = '_headerName_' + item;
                //
                var ifInptuInTd = tr.querySelector('td.' + className);
                if (!ifInptuInTd) {
                  //说明这个合并单元格，合并单元格展示的部分应该一致的
                  self.tableData[curRowIndex][item] =
                    self.tableData[curRowIndex - 1] &&
                    self.tableData[curRowIndex - 1][item];
                  return;
                }
                if (ifInptuInTd)
                  var ifInput = ifInptuInTd.querySelector('input');
                if (
                  ifInput &&
                  !ifInput.getAttribute('disabled') &&
                  idx < textAfterFormat[i].length
                ) {
                  self.tableData[curRowIndex][item] = textAfterFormat[i][idx];
                  if (ifInptuInTd.rowSpan > 1) {
                    //说明这rowSpan的行数就是该列合并单元格的函数，合并单元格展示的部分应该一致的
                    for (let i = 1; i <= ifInptuInTd.rowSpan - 1; i++) {
                      self.tableData[curRowIndex + i][item] =
                        self.tableData[curRowIndex][item];
                    }
                  }
                }
              });
            }
          });
        });
      },
    },
  },
  created() {
    for (let i = 0; i <= 20; i++) {
      let obj = {
        date: '2016-' + Math.ceil(i / 12) + '-02',
        name: '王小虎' + i,
        job: '学生' + i,
        hobby: '游戏' + i,
        combineCell1: '合并' + (i % 12 > 6 ? '1' : '2') + '-1',
        combineCell2: '合并' + (i % 12 > 7 ? '3' : '4') + '-2',
        combineCell3: '合并' + (i % 12 > 2 ? '5' : '6') + '-3',
        address: '金沙江路 1518 弄' + 'i',
        address1: '金沙江路 1519 弄' + 'i',
        address2: '金沙江路 1519 弄' + 'i',
        age: 18 + Number(i),
        gender: i / 2 ? 'female' : 'male',
      };
      this.tableData.push(obj);
    }
    headername = [];
    this.getSpanList();
  },
  methods: {
    spanMethod({ rowIndex, columnIndex }) {
      // eslint-disable-next-line no-debugger
      debugger;
      if (columnIndex == 0 && this.spanList1[rowIndex]) {
        return {
          rowspan: Number(this.spanList1[rowIndex]),
          colspan: 1,
        };
      } else if (columnIndex == 1 && this.spanList2[rowIndex]) {
        return {
          rowspan: Number(this.spanList2[rowIndex]),
          colspan: 1,
        };
      } else if (columnIndex == 2 && this.spanList3[rowIndex]) {
        return {
          rowspan: Number(this.spanList3[rowIndex]),
          colspan: 1,
        };
      } else if (columnIndex == 7 && this.spanList4[rowIndex]) {
        return {
          rowspan: Number(this.spanList4[rowIndex]),
          colspan: 1,
        };
      } else if (columnIndex >= 3 && columnIndex != 7) {
        return {
          rowspan: 1,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    getSpanList() {
      for (let rowIndex in this.tableData) {
        if (
          rowIndex == 0 ||
          this.tableData[rowIndex].combineCell1 !=
            this.tableData[rowIndex - 1].combineCell1
        ) {
          this.spanList1.push(rowIndex);
          this.spanList2.push(rowIndex);
          this.spanList3.push(rowIndex);
          // this.spanList4.push(rowIndex)
        } else if (
          this.tableData[rowIndex].combineCell2 !=
          this.tableData[rowIndex - 1].combineCell2
        ) {
          this.spanList2.push(rowIndex);
          this.spanList3.push(rowIndex);
        } else if (
          this.tableData[rowIndex].combineCell3 !=
          this.tableData[rowIndex - 1].combineCell3
        ) {
          this.spanList3.push(rowIndex);
        }
        if (
          rowIndex == 0 ||
          this.tableData[rowIndex].name != this.tableData[rowIndex - 1].name
        ) {
          this.spanList4.push(rowIndex);
        }
        if (Number(rowIndex) + 1 >= this.tableData.length) {
          this.spanList1.push(Number(rowIndex) + 1);
          this.spanList2.push(Number(rowIndex) + 1);
          this.spanList3.push(Number(rowIndex) + 1);
          this.spanList4.push(Number(rowIndex) + 1);
        }
      }
      function transferArrToObj(arr) {
        var obj = {};
        // debugger
        for (let i in arr) {
          if (arr[Number(i) + 1]) {
            obj[arr[i]] = Number(arr[Number(i) + 1]) - Number(arr[i]);
          }
        }
        return obj;
      }
      this.spanList1 = transferArrToObj(this.spanList1);
      this.spanList2 = transferArrToObj(this.spanList2);
      this.spanList3 = transferArrToObj(this.spanList3);
      this.spanList4 = transferArrToObj(this.spanList4);
      // eslint-disable-next-line no-debugger
      debugger;
    },
    handleClick() {
      this.show = !this.show;
      //每次收起展开都把表头的数组清空，在下面的getHeaderCellStyle重新获取
      headername.length = 0;
    },
    getHeaderCellStyle({ column }) {
      //获得标题，这里需要在上面设置prop属性
      headername.push(column.property);
    },
    getCellClassName({ column }) {
      //获得标题，这里需要在上面设置prop属性
      return ' _headerName_' + column.property + ' ';
    },
  },
};
</script>
