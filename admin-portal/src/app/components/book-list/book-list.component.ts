import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/book';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {GetBookListService} from '../../services/get-book-list.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {RemoveBookService} from '../../services/remove-book.service';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  private selectedBook : Book;
  private checked: boolean;
  private bookList: Book[];
  private allChecked: boolean;
  private removeBookList: Book[] = new Array();

  constructor(
    private getBookListService: GetBookListService,
    private removeBookService: RemoveBookService,
    private router:Router,
    public dialog:MatDialog
    ) { }
  //fucntion to navigate to each book
  onSelect(book:Book) {
    this.selectedBook=book;
    this.router.navigate(['/viewBook', this.selectedBook.id]);
  }
//function for a dialog appears when we want to remove a particular book
  openDialog(book:Book) {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if(result=="yes") {
          this.removeBookService.sendBook(book.id).subscribe(
            res => {
              console.log(res);
              this.getBookList();
            }, 
            err => {
              console.log(err);
            }
            );
        }
      }
      );
  }

//push the updated book onto the list or remove it 
  updateRemoveBookList(checked:boolean, book:Book) {
    if(checked) {
      this.removeBookList.push(book);
    } else {
      this.removeBookList.splice(this.removeBookList.indexOf(book), 1);
    }
  }
//to update the books
  updateSelected(checked: boolean) {
    if(checked) {
      this.allChecked = true;
      this.removeBookList=this.bookList.slice();
    } else {
      this.allChecked=false;
      this.removeBookList=[];
    }
  }
  //function to remove the books selected by the admin by checking the booklist
  removeSelectedBooks() {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if(result=="yes") {
          for (let book of this.removeBookList) {
            this.removeBookService.sendBook(book.id).subscribe(
              res => {

              }, 
              err => {
              }
              );
          }
          location.reload();
        }
      }
      ); 
  }
//function to display the booklist
  getBookList() {
    this.getBookListService.getBookList().subscribe(
      res => {
        console.log(res.json());
        this.bookList=res.json();
      }, 
      error => {
        console.log(error);
      }
      );
  }



  ngOnInit() {
  this.getBookList();
  }
  

}


@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html'
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogResultExampleDialog>) {}
}