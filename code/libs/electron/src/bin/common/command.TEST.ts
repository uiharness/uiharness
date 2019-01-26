import { expect } from 'chai';
import { command } from '.';

describe('command', () => {
  it('starts with no value', () => {
    const cmd = command();
    expect(cmd.value).to.eql('');
    expect(cmd.toString()).to.eql('');
  });

  it('starts with a base value (string)', () => {
    const cmd = command('foo');
    expect(cmd.value).to.eql('foo');
    expect(cmd.toString()).to.eql('foo');
  });

  it('starts with a base value (Command)', () => {
    const base = command('foo').arg('force');
    const cmd = command(base);
    expect(cmd.value).to.eql('foo --force');
    expect(cmd.toString()).to.eql('foo --force');
  });

  it('adds an argument', () => {
    expect(command('run').arg('force').value).to.eql('run --force');
    expect(command('run').arg('--force').value).to.eql('run --force');
    expect(command('run').arg('---force').value).to.eql('run --force');
    expect(command('run').arg('-force').value).to.eql('run --force');
    expect(command('run').arg(' --force  ').value).to.eql('run --force');
    expect(command('run').arg('   -force  ').value).to.eql('run --force');
  });

  it('adds an argument (alias)', () => {
    expect(command('run').alias('f').value).to.eql('run -f');
    expect(command('run').alias('-f').value).to.eql('run -f');
    expect(command('run').alias('--f').value).to.eql('run -f');
    expect(command('run').alias(' -f  ').value).to.eql('run -f');
    expect(command('run').alias(' --f  ').value).to.eql('run -f');
  });

  it('adds a new-line', () => {
    const cmd = command('cd ./dir')
      .newLine()
      .add('run');
    expect(cmd.toString()).to.eql(`cd ./dir\nrun`);
  });

  it('adds a command as a new-line', () => {
    const cmd = command()
      .addLine('cd ./dir')
      .addLine('run');
    expect(cmd.toString()).to.eql(`cd ./dir\nrun\n`);
  });

  it('is immutable', () => {
    const cmd1 = command();
    const cmd2 = cmd1.add('foo');
    const cmd3 = cmd2.arg('force');
    const cmd4 = cmd3.alias('c');
    const cmd5 = cmd4.newLine();
    const cmd6 = cmd5.addLine('cd bar');

    expect(cmd2).to.not.equal(cmd1);
    expect(cmd3).to.not.equal(cmd2);
    expect(cmd4).to.not.equal(cmd3);
    expect(cmd5).to.not.equal(cmd4);
    expect(cmd6).to.not.equal(cmd5);
  });
});
