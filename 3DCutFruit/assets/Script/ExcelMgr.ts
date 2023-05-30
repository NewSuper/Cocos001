import { _decorator, Component, Node } from 'cc';
import CSV from './3rd/CSVParser';

export class ExcelMgr extends Component {
    public static Instance: ExcelMgr = null as unknown as ExcelMgr;
    
    public onLoad(): void {
        if(ExcelMgr.Instance === null) {
            ExcelMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
    }

    loadCallback: Function = null as unknown as Function;
    cntLoad: number = 0;
    curLoad: number = 0;

    csvTablesLoaded: any = {};

    csvTables:any = {};
    csvTableForArr:any = {};
    tableCast:any = {};
    tableComment:any = {};

    addTable (tableName:string, tableContent:string, force?:boolean) {
        if (this.csvTables[tableName] && !force) {
            return;
        }

        var tableData = {};
        var tableArr = []; 
        var opts = { header: true };
        CSV.parse(tableContent, opts, function (row, keyname) {
            tableData[row[keyname]] = row;
            tableArr.push(row);
        });

        this.tableCast[tableName] = (CSV as any).opts.cast;
        this.tableComment[tableName] = (CSV as any).opts.comment;

        this.csvTables[tableName] = tableData;
        this.csvTableForArr[tableName] = tableArr;

        //this.csvTables[tableName].initFromText(tableContent);
    }

    getTableArr (tableName:string) {
        return this.csvTableForArr[tableName];
    }

    getTable (tableName:string) {
        return this.csvTables[tableName];
    }

    queryOne (tableName:string, key:string, value:any) {
        var table = this.getTable(tableName);
        if (!table) {
            return null;
        }
        
        if (key) {
            for (var tbItem in table) {
                if (!table.hasOwnProperty(tbItem)) {
                    continue;
                }

                if (table[tbItem][key] === value) {
                    return table[tbItem];
                }
            }
            
        } else {
            return table[value];
        }
    }

    queryByID (tableName:string, ID:string) {
        return this.queryOne(tableName, null, ID);
    }

    queryAll (tableName:string, key:string, value:any) {
        var table = this.getTable(tableName);
        if (!table || !key) {
            return null;
        }

        var ret = {};
        for (var tbItem in table) {
            if (!table.hasOwnProperty(tbItem)) {
                continue;
            }

            if (table[tbItem][key] === value) {
                ret[tbItem] = table[tbItem];
            }
        }

        return ret;
    }

    queryIn (tableName:string, key:string, values:Array<any>) {
        var table = this.getTable(tableName);
        if (!table || !key) {
            return null;
        }

        var ret = {};
        var keys = Object.keys(table);
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var item = table[keys[i]];
            if (values.indexOf(item[key]) > -1) {
                ret[keys[i]] = item;
            }
        }

        return ret;
    }

    queryByCondition (tableName:string, condition: any) {
        if (condition.constructor !== Object) {
            return null;
        }

        var table = this.getTable(tableName);
        if (!table) {
            return null;
        }

        var ret = {};
        var tableKeys = Object.keys(table);
        var tableKeysLength = tableKeys.length;
        var keys = Object.keys(condition);
        var keysLength = keys.length;
        for (var i = 0; i < tableKeysLength; i++) {
            var item = table[tableKeys[i]];
            var fit = true;
            for (var j = 0; j < keysLength; j++) {
                var key = keys[j];
                fit = fit && (condition[key] === item[key]) && !ret[tableKeys[i]];
            }

            if (fit) {
                ret[tableKeys[i]] = item;
            }
        }

        return ret;
    }

    queryOneByCondition (tableName:string, condition: any) {
        if (condition.constructor !== Object) {
            return null;
        }

        var table = this.getTable(tableName);
        if (!table) {
            return null;
        }
        
        var keys = Object.keys(condition);
        var keysLength = keys.length;

        for (let keyName in table) {
            var item = table[keyName];

            var fit = true;
            for (var j = 0; j < keysLength; j++) {
                var key = keys[j];
                fit = fit && (condition[key] === item[key]);
            }

            if (fit) {
                return item;
            }
        }

        return null;
    }
}


